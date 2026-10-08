import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VcService } from 'src/did/vc.service';
import { UtilsService } from '@Common';
import { ConfigType } from '@nestjs/config';
import { userConfigFactory } from '@Config';
import { MailService } from 'src/mail';
import { EncryptionService } from 'src/encryption/encryption.service';

@Injectable()
export class CertificateService {
  // encryptionService: any;
  constructor(
    private readonly prisma: PrismaService,
    private readonly vcService: VcService,
    private readonly utilsService: UtilsService,
    private readonly mailService: MailService,
    private readonly encryptionService: EncryptionService,
    @Inject(userConfigFactory.KEY)
    private readonly config: ConfigType<typeof userConfigFactory>,
  ) {}

  private hashPassword(password: string): { salt: string; hash: string } {
    const salt = this.utilsService.generateSalt(this.config.passwordSaltLength);

    const hash = this.utilsService.hashPassword(
      password,
      salt,
      this.config.passwordHashLength,
    );

    return { salt, hash };
  }

  // const publicKey = employee.publicKey!;

  // async verify(id: number) {
  //   const certificate = await this.prisma.certificate.findUnique({
  //     where: { id },
  //   });

  //   if (!certificate) {
  //     throw new NotFoundException('Certificate not found');
  //   }

  //   const result = await this.vcService.verifyCredential(
  //     certificate.verifiableCredentials,
  //   );

  //   return {
  //     verified: result.verified,
  //     error: result.error,
  //   };
  // }

  async create(employeeId: number) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    if (!employee.did) {
      throw new BadRequestException('Employee does not have a DID');
    }

    const existingCertificate = await this.prisma.certificate.findUnique({
      where: { employeeId },
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

    const password = this.utilsService.generateRandomToken(7);

    const { salt, hash } = this.hashPassword(password);

    const shareToken = this.utilsService.generateRandomToken(32);

    const certificate = await this.prisma.$transaction(async (tx) => {
      const certificate = await tx.certificate.create({
        data: {
          employeeId: employee.id,
          verifiableCredentials: signedCredential,
          shareToken,
        },
      });

      await tx.employee.update({
        where: {
          id: employee.id,
        },
        data: {
          passwordHash: hash,
          passwordSalt: salt,
        },
      });
      return certificate;
    });

    const privateKey = this.encryptionService.decrypt(
      employee.encryptedPrivateKey!,
    );
    const publicKey = employee.publicKey!;

    await this.mailService.send({
      to: employee.personalEmail!,
      subject: 'Your Employee Certificate Login Details',
      mailBodyOrTemplate: {
        name: 'employee-credentials',
        data: {
          employeeName: employee.name,
          email: employee.personalEmail!,
          password,
          loginUrl: `http://localhost:5173/employee/${employee.accessUrlToken}`,
          publicKey,
          privateKey,
        },
      },
    });

    return certificate;
  }

  async findAll() {
    // page: number, limit: number
    // const skip = (page - 1) * limit;

    const [certificates, total] = await Promise.all([
      this.prisma.certificate.findMany({
        // skip,
        // take: limit,
        orderBy: {
          issuedAt: 'desc',
        },
      }),

      this.prisma.certificate.count(),
    ]);

    return {
      data: certificates,
      total,
      // page,
      // limit,
    };
  }

  // async getPublicCertificate(shareToken: string) {
  //   const certificate = await this.prisma.certificate.findUnique({
  //     where: {
  //       shareToken,
  //     },
  //     select: {
  //       id: true,
  //       verifiableCredentials: true,
  //       issuedAt: true,
  //       employee: {
  //         select: {
  //           name: true,
  //           did: true,
  //         },
  //       },
  //     },
  //   });

  //   if (!certificate) {
  //     throw new NotFoundException('Certificate not found');
  //   }
  //   //   vc verification n
  //   const result = await this.vcService.verifyCredential(
  //     certificate.verifiableCredentials,
  //   );

  //   return {
  //     certificate: {
  //       id: certificate.id,
  //       verifiableCredentials: certificate.verifiableCredentials,
  //       issuedAt: certificate.issuedAt,
  //       employee: certificate.employee,
  //     },
  //     verification: {
  //       verified: result.verified,
  //       error: result.error,
  //     },
  //   };
  // }
}
