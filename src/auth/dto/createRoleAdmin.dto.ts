import { IsNotEmpty, MinLength } from 'class-validator';

export class RoleAdminDto {
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
