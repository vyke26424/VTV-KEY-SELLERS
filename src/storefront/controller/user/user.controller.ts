import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common'; // Thêm Body, Patch
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../../auth/decorators/get_user.decorator';
import { UserService } from '../../services/user/user.service';
import { UpdateProfileDto } from '../../dto/update-profile.dto';

@Controller('users') 
export class UserController {
    constructor(private readonly userService : UserService){}

    // API: GET /users/me
    @Get('me')
    @UseGuards(JwtAuthGuard)
    async me (@GetUser('userId') userId : string) {
        return await this.userService.getProfile(userId);
    }

    // API: PATCH /users/profile
    @Patch('profile')
    @UseGuards(JwtAuthGuard)
    async updateProfile(
        @GetUser('userId') userId: string, 
        @Body() data: UpdateProfileDto
    ) {
        return await this.userService.updateProfile(userId, data);
    }
}