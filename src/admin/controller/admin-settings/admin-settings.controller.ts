import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AdminSettingsService } from '../../services/admin-settings/admin-settings.service';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../../guard/role.guard';
import { Roles } from '../../decorator/role.decorator';
import { Role } from '@prisma/client';

@Controller('admin/settings')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.ADMIN)
export class AdminSettingsController {
  constructor(private readonly settingsService: AdminSettingsService) {}

  @Get()
  async getConfig() {
    return await this.settingsService.getConfig();
  }

  @Patch()
  async updateConfig(@Body() data: any) {
    return await this.settingsService.updateConfig(data);
  }
}