import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private generateReferralCode(email: string): string {
    const prefix = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4);
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${random}`;
  }

  private async generateTokens(userId: string, email: string) {
    const accessSecret =
      this.configService.get<string>('JWT_ACCESS_SECRET') || 'dev_access_secret_change_me';
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') || 'dev_refresh_secret_change_me';

    const accessToken = await this.jwtService.signAsync(
      { sub: userId, email, type: 'access' },
      { secret: accessSecret, expiresIn: '15m' },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: userId, email, type: 'refresh' },
      { secret: refreshSecret, expiresIn: '7d' },
    );

    return { accessToken, refreshToken };
  }

  async signup(dto: SignupDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const referralCode = this.generateReferralCode(dto.email);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        name: dto.name || dto.email.split('@')[0],
        provider: 'credentials',
        referralCode,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: user.provider,
        referralCode: user.referralCode,
        createdAt: user.createdAt,
      },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: user.provider,
        referralCode: user.referralCode,
        createdAt: user.createdAt,
      },
      ...tokens,
    };
  }

  async refresh(dto: RefreshDto) {
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') || 'dev_refresh_secret_change_me';

    try {
      const payload = await this.jwtService.verifyAsync(dto.refreshToken, {
        secret: refreshSecret,
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User no longer exists');
      }

      return this.generateTokens(user.id, user.email);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      // Return success to avoid email enumeration
      return { message: 'If an account exists, a password reset link has been generated.' };
    }

    const resetSecret =
      this.configService.get<string>('JWT_ACCESS_SECRET') || 'dev_access_secret_change_me';
    const resetToken = await this.jwtService.signAsync(
      { sub: user.id, type: 'reset' },
      { secret: resetSecret, expiresIn: '1h' },
    );

    // Dev mode log per PRD Section 8.8
    console.log(`🔑 Password reset token for ${user.email}: ${resetToken}`);

    return {
      message: 'If an account exists, a password reset link has been generated.',
      resetToken, // Returned for dev testing convenience
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const resetSecret =
      this.configService.get<string>('JWT_ACCESS_SECRET') || 'dev_access_secret_change_me';

    try {
      const payload = await this.jwtService.verifyAsync(dto.token, {
        secret: resetSecret,
      });

      if (payload.type !== 'reset') {
        throw new BadRequestException('Invalid reset token');
      }

      const passwordHash = await bcrypt.hash(dto.newPassword, 12);

      await this.prisma.user.update({
        where: { id: payload.sub },
        data: { passwordHash },
      });

      return { message: 'Password updated successfully' };
    } catch {
      throw new BadRequestException('Invalid or expired reset token');
    }
  }

  async validateGoogleUser(profile: { email: string; name?: string }) {
    let user = await this.prisma.user.findUnique({
      where: { email: profile.email.toLowerCase() },
    });

    if (!user) {
      const referralCode = this.generateReferralCode(profile.email);
      user = await this.prisma.user.create({
        data: {
          email: profile.email.toLowerCase(),
          name: profile.name || profile.email.split('@')[0],
          provider: 'google',
          referralCode,
        },
      });
    }

    const tokens = await this.generateTokens(user.id, user.email);
    return { user, ...tokens };
  }
}
