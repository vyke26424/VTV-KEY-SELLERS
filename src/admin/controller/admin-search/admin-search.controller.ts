import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminSearchService } from '../../services/admin-search/admin-search.service';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../../guard/role.guard';
import { Roles } from '../../decorator/role.decorator';
import { Role } from '@prisma/client';

@Controller('admin/search')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.ADMIN)
export class AdminSearchController {
  constructor(private readonly searchService: AdminSearchService) {}

  @Get()
  search(@Query('q') q: string) {
    return this.searchService.searchGlobal(q);
  }
}