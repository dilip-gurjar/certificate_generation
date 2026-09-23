import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}
  create(createEmployeeDto: CreateEmployeeDto) {
    return this.prisma.employee.create({
      data: {
        name: createEmployeeDto.name,
        workEmail: createEmployeeDto.workEmail,
        personalEmail: createEmployeeDto.personalEmail,
        joiningDate: new Date(createEmployeeDto.joiningDate),
        leavingDate: createEmployeeDto.leavingDate
          ? new Date(createEmployeeDto.leavingDate)
          : null,
      },
    });
  }

  async findAll({ skip = 0, take = 5 }: { skip?: number; take?: number }) {
    const employees = await this.prisma.employee.findMany({
      where: {
        deletedAt: null,
      },
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return employees;
  }

  async findOne(id: number) {
    return this.prisma.employee.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return this.prisma.employee.update({
      where: {
        id,
      },
      data: {
        ...(updateEmployeeDto.name !== undefined && {
          name: updateEmployeeDto.name,
        }),

        ...(updateEmployeeDto.workEmail !== undefined && {
          workEmail: updateEmployeeDto.workEmail,
        }),

        ...(updateEmployeeDto.personalEmail !== undefined && {
          personalEmail: updateEmployeeDto.personalEmail,
        }),

        ...(updateEmployeeDto.joiningDate !== undefined && {
          joiningDate: new Date(updateEmployeeDto.joiningDate),
        }),

        ...(updateEmployeeDto.leavingDate !== undefined && {
          leavingDate: updateEmployeeDto.leavingDate
            ? new Date(updateEmployeeDto.leavingDate)
            : null,
        }),
      },
    });
  }

  async remove(id: number) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return this.prisma.employee.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
