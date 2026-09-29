import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VcService } from 'src/did/vc.service';

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

      if (!employee.did) {
        throw new BadRequestException('Employee does not have a DID');
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
        did: employee.did,
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
