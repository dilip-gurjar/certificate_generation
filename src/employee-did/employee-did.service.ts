import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EncryptionService } from '../encryption/encryption.service';
import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';
import { driver } from '@digitalbazaar/did-method-key';

@Injectable()
export class EmployeeDidService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async generateDid() {
    const verificationKeyPair = await Ed25519VerificationKey2020.generate();

    // Create did:key driver
    const didKeyDriver = driver();

    // Tell did:key driver how to handle Ed25519 keys
    didKeyDriver.use({
      multibaseMultikeyHeader: 'z6Mk',
      fromMultibase: Ed25519VerificationKey2020.from,
    });

    // Generate DID Document from key pair
    const { didDocument, methodFor } = await didKeyDriver.fromKeyPair({
      verificationKeyPair,
    });

    // Get the assertionMethod key
    const assertionKeyPair = methodFor({
      purpose: 'assertionMethod',
    });

    // Export original private key
    const exportedKey = await verificationKeyPair.export({
      publicKey: true,
      privateKey: true,
    });

    return {
      did: didDocument.id,
      publicKeyMultibase: exportedKey.publicKeyMultibase,
      privateKeyMultibase: exportedKey.privateKeyMultibase,
      assertionKeyId: assertionKeyPair.id,
    };
  }

  async getPrivateKey(employeeId: number) {
    const employee = await this.prisma.employee.findUnique({
      where: {
        id: employeeId,
      },
      select: {
        id: true,
        did: true,
        publicKey: true,
        encryptedPrivateKey: true,
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    if (!employee.encryptedPrivateKey) {
      throw new NotFoundException('Employee private key not found');
    }

    const privateKeyMultibase = this.encryptionService.decrypt(
      employee.encryptedPrivateKey,
    );

    return {
      did: employee.did,
      publicKeyMultibase: employee.publicKey,
      privateKeyMultibase,
    };
  }

  async getVerificationKey(employeeId: number) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
      select: {
        did: true,
        publicKey: true,
        encryptedPrivateKey: true,
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    if (!employee.did || !employee.publicKey || !employee.encryptedPrivateKey) {
      throw new NotFoundException('Employee DID keys not found');
    }

    const privateKeyMultibase = this.encryptionService.decrypt(
      employee.encryptedPrivateKey,
    );

    const verificationKey = await Ed25519VerificationKey2020.from({
      id: employee.did,
      controller: employee.did,
      type: 'Ed25519VerificationKey2020',
      publicKeyMultibase: employee.publicKey,
      privateKeyMultibase,
    });

    return verificationKey;
  }
  async testKeyPair(employeeId: number) {
    const key = await this.getVerificationKey(employeeId);

    const message = new TextEncoder().encode('employee-did-test');

    const signer = key.signer();

    const signature = await signer.sign({
      data: message,
    });

    const verifier = key.verifier();

    const verified = await verifier.verify({
      data: message,
      signature,
    });

    return {
      verified,
      message: 'employee-did-test',
    };
  }
}
