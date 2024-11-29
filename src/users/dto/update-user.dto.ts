import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsEnum } from 'class-validator';
import { UserRole } from '../enums/role.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateRoleDto {
  @ApiProperty({
    enum: UserRole,
    enumName: 'UserRole',
    example: UserRole.EDITOR,
    description: 'Available roles: ADMIN, EDITOR, VIEWER',
  })
  @IsEnum(UserRole, {
    message: 'Invalid role. Must be one of: ADMIN, EDITOR, VIEWER',
  })
  role: UserRole;
}
