import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmployeeDidService } from 'src/employee-did/employee-did.service';
import { EncryptionService } from 'src/encryption/encryption.service';
import { UserType, UtilsService } from '@Common';
import { userConfigFactory } from '@Config';
import { ConfigType } from '@nestjs/config';
import PDFDocument from 'pdfkit';

@Injectable()
export class EmployeeService {
  // findById(id: number) {
  //   throw new Error('Method not implemented.');
  // }
  constructor(
    @Inject(userConfigFactory.KEY)
    private readonly config: ConfigType<typeof userConfigFactory>,

    private readonly prisma: PrismaService,
    private readonly employeeDidService: EmployeeDidService,
    private readonly encryptionService: EncryptionService,
    private readonly utilsService: UtilsService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const didData = await this.employeeDidService.generateDid();
    // console.log("did", didData)

    const encryptedPrivateKey = this.encryptionService.encrypt(
      didData.privateKeyMultibase,
    );
    const accessUrlToken = this.utilsService.generateRandomToken(32);

    // console.log("url_token",accessUrlToken);

    const employee = await this.prisma.employee.create({
      data: {
        name: createEmployeeDto.name,
        workEmail: createEmployeeDto.workEmail,
        personalEmail: createEmployeeDto.personalEmail,
        passwordHash: null,
        passwordSalt: null,
        joiningDate: new Date(createEmployeeDto.joiningDate),

        leavingDate: createEmployeeDto.leavingDate
          ? new Date(createEmployeeDto.leavingDate)
          : null,

        did: didData.did,

        publicKey: didData.publicKeyMultibase,

        encryptedPrivateKey,
        accessUrlToken,
      },
    });
    return {
      employee,
      // temporarypassword:password,
    };
  }

  async findAll() {
    const where = {
      deletedAt: null,
    };

    const [employees, total] = await Promise.all([
      this.prisma.employee.findMany({
        where,
        // skip,
        // take,
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.employee.count({
        where,
      }),
    ]);

    return {
      data: employees,
      total,
      // skip,
      // take,
    };
  }

  async findOne(id: number) {
    return this.prisma.employee.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async getPublicEmployee(token: string) {
    const employee = await this.prisma.employee.findFirst({
      where: {
        accessUrlToken: token,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        did: true,
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  async getMyCertificate(id: number) {
    const employee = await this.prisma.employee.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        name: true,
        did: true,

        certificate: {
          select: {
            id: true,
            verifiableCredentials: true,
            issuedAt: true,
            shareToken: true,
          },
        },
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    if (!employee.certificate) {
      throw new NotFoundException('Certificate not found');
    }

    return employee;
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

  async validateCredentials(personalEmail: string, password: string) {
    const employee = await this.prisma.employee.findUnique({
      where: {
        personalEmail: personalEmail.toLowerCase(),
      },
    });
    if (!employee) {
      return null;
    }
    const passwordHash = this.utilsService.hashPassword(
      password,
      employee.passwordSalt || '',
      employee.passwordHash ? employee.passwordHash.length / 2 : 0,
    );

    if (employee.passwordHash === passwordHash) {
      return {
        id: employee.id,
        type: UserType.Employee,
      };
    }

    return false;
  }

  async generateCertificatePdf(employeeId: number): Promise<Buffer> {
    const employee = await this.prisma.employee.findUnique({
      where: {
        id: employeeId,
        deletedAt: null,
      },
      select: {
        name: true,
        did: true,
        joiningDate: true,
        leavingDate: true,
        workEmail: true,
        certificate: {
          select: {
            id: true,
            verifiableCredentials: true,
            issuedAt: true,
          },
        },
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const certificate = employee.certificate;

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
    });

    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => {
      chunks.push(chunk);
    });

    return new Promise((resolve, reject) => {
      doc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });

      doc.on('error', reject);

      doc.fontSize(26).font('Helvetica-Bold').text('EMPLOYMENT CERTIFICATE', {
        align: 'center',
      });

      doc.moveDown(2);

      doc
        .fontSize(14)
        .font('Helvetica')
        .text(
          `This is to certify that ${employee.name} was employed with our organization.`,
          {
            align: 'center',
          },
        );

      doc.moveDown(2);

      doc.fontSize(12);

      doc.text(`Employee Name: ${employee.name}`);
      doc.moveDown(0.5);

      doc.text(`Employee DID: ${employee.did ?? 'N/A'}`);
      doc.moveDown(0.5);

      doc.text(`Joining Date: ${employee.joiningDate.toDateString()}`);

      doc.moveDown(0.5);

      if (employee.leavingDate) {
        doc.text(`Leaving Date: ${employee.leavingDate.toDateString()}`);

        doc.moveDown(0.5);
      }

      doc.text(`Work Email: ${employee.workEmail}`);

      doc.moveDown(2);

      doc.text(`Certificate ID: ${certificate.id}`);

      doc.text(`Issued At: ${certificate.issuedAt.toDateString()}`);

      doc.moveDown(3);

      doc
        .fontSize(11)
        .text('This certificate contains a digitally verifiable credential.', {
          align: 'center',
        });

      doc.end();
    });
  }
}
