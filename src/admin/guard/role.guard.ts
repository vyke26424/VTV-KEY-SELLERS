import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "@prisma/client";
import { Observable } from "rxjs";
import { ROLES_KEY } from "../decorator/role.decorator";


@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly reflector : Reflector){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requireRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getClass(),
            context.getHandler()
        ]);
        if(!requireRoles) {
            return true;
        }
        const {user} =  context.switchToHttp().getRequest();
        if(!user || ! user.role) {
            return false;
        }
        return requireRoles.includes(user.role);

        // nếu sau này user nó có nhiều vai trò ['user], ['admin'], còn giờ thì kệ
       // return requireRoles.some((role) => user.role?.includes(role));
    }

   

}