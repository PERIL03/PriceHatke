import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID') || 'placeholder_client_id';
    const clientSecret =
      configService.get<string>('GOOGLE_CLIENT_SECRET') || 'placeholder_client_secret';
    const backendUrl = configService.get<string>('BACKEND_URL') || 'http://localhost:8080';

    super({
      clientID,
      clientSecret,
      callbackURL: `${backendUrl}/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails } = profile;
    const email = emails[0].value;
    const fullName = `${name.givenName || ''} ${name.familyName || ''}`.trim();

    const authResult = await this.authService.validateGoogleUser({
      email,
      name: fullName,
    });

    done(null, authResult);
  }
}
