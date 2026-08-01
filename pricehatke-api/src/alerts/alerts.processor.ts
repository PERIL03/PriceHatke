import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { AlertsService } from './alerts.service';
import { Logger } from '@nestjs/common';

@Processor('alerts')
export class AlertsProcessor extends WorkerHost {
  private readonly logger = new Logger(AlertsProcessor.name);

  constructor(private readonly alertsService: AlertsService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing background job: ${job.name} (ID: ${job.id})`);

    switch (job.name) {
      case 'evaluate-alerts': {
        const result = await this.alertsService.evaluateAlerts();
        this.logger.log(
          `Alert evaluation completed. Evaluated: ${result.evaluated}, Triggered: ${result.triggered}`,
        );
        return result;
      }
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
        return null;
    }
  }
}
