import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VcService } from 'src/did/vc.service';
// import { CreateCertificateDto } from './dto/create-certificate.dto';

@Injectable()
export class CertificateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vcService: VcService,
  ) {}

  async verify(id: number) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { id },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    const result = await this.vcService.verifyCredential(
      certificate.verifiableCredentials,
    );

    return {
      verified: result.verified,
      error: result.error,
    };
  }
  async create(employeeId: number) {
    return this.prisma.$transaction(async (tx) => {
      const employee = await tx.employee.findUnique({
        where: {
          id: employeeId,
        },
      });

      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      const existingCertificate = await tx.certificate.findUnique({
        where: {
          employeeId,
        },
      });

      if (existingCertificate) {
        throw new ConflictException(
          'Certificate already exists for this employee',
        );
      }

      // Create + sign Verifiable Credential
      const signedCredential = await this.vcService.createCredential({
        id: employee.id,
        name: employee.name,
        workEmail: employee.workEmail,
        joiningDate: employee.joiningDate,
        leavingDate: employee.leavingDate,
      });

      // Store signed VC
      await tx.certificate.create({
        data: {
          employeeId: employee.id,
          verifiableCredentials: signedCredential,
        },
      });

      return signedCredential;
    });
  }

  //   async create(employeeId: number) {
  //     return this.prisma.$transaction(async (tx) => {
  //       const employee = await tx.employee.findUnique({
  //         where: { id: employeeId },
  //       });

  //       if (!employee) {
  //         throw new NotFoundException('Employee not found');
  //       }

  //       const existingCertificate =
  //         await tx.certificate.findUnique({
  //           where: { employeeId },
  //         });

  //       if (existingCertificate) {
  //         throw new ConflictException(
  //           'Certificate already exists for this employee',
  //         );
  //       }

  //       const signedCredential =
  //         await this.vcService.createCredential({
  //           id: employee.id,
  //           name: employee.name,
  //           workEmail: employee.workEmail,
  //           joiningDate: employee.joiningDate,
  //           leavingDate: employee.leavingDate,
  //         });

  //       // Save VC in Employee table
  //       await tx.employee.update({
  //         where: { id: employee.id },
  //         data: {
  //           certificateData: signedCredential,
  //         },
  //       });

  //       // Save VC in Certificate table
  //       await tx.certificate.create({
  //         data: {
  //           employeeId: employee.id,
  //           verifiableCredentials: signedCredential,
  //         },
  //       });

  //       return signedCredential;
  //     });
  //   }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [certificates, total] = await Promise.all([
      this.prisma.certificate.findMany({
        skip,
        take: limit,

        orderBy: {
          issuedAt: 'desc',
        },
      }),

      this.prisma.certificate.count(),
    ]);

    return {
      data: certificates,
    };
  }
}
