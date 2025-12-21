import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../../auth/decorators/get_user.decorator';
import { UserService } from '../../services/user/user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService : UserService){}
    @Get('me')
    @UseGuards(JwtAuthGuard)
    async me (@GetUser('userId') userId : string) {
        return await this.userService.getProfile(userId);
    }
}
