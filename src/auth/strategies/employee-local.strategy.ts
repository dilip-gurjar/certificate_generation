import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { EmployeeService } from 'src/employee/employee.service';
import { EMPLOYEE_LOCAL_AUTH } from '../auth.constants';

@Injectable()
export class EmployeeLocalStrategy extends PassportStrategy(
  Strategy,
  EMPLOYEE_LOCAL_AUTH,
) {
  constructor(private readonly employeeService: EmployeeService) {
    super({
      usernameField: 'personalEmail',
    });
  }

  async validate(personalEmail: string, password: string) {
    const employee = await this.employeeService.validateCredentials(
      personalEmail,
      password,
    );

    if (employee) {
      return employee;
    }

    if (employee === false) {
      throw new UnauthorizedException('Incorrect password');
    }

    throw new UnauthorizedException('Employee does not exist');
  }
}
