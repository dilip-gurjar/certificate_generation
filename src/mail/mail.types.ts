type VerificationCodeMailPayload = {
  username: string;
  code: string;
  expirationTime: string;
};

export type RegisterVerificationCodeMailTemplate = {
  name: 'register-verification-code';
  data: VerificationCodeMailPayload;
};

export type ResetPasswordVerificationCodeMailTemplate = {
  name: 'reset-password-verification-code';
  data: VerificationCodeMailPayload;
};

type EmployeeCredentialsMailPayload = {
  employeeName: string;
  email: string;
  password: string;
  loginUrl: string;
  publicKey: string;
  privateKey: string;
};
export type EmployeeCredentialsMailTemplate = {
  name: 'employee-credentials';
  data: EmployeeCredentialsMailPayload;
};

export type MailTemplate =
  | RegisterVerificationCodeMailTemplate
  | ResetPasswordVerificationCodeMailTemplate
  | EmployeeCredentialsMailTemplate;

export type MailParams = { subject: string; template: MailTemplate };
