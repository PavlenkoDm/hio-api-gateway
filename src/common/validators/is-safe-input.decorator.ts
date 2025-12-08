import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isSafeInput', async: false })
export class IsSafeInputConstraint implements ValidatorConstraintInterface {
  private readonly securityPatterns = [
    {
      pattern:
        /\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|WHERE|FROM|JOIN|TRUNCATE|GRANT|REVOKE|TABLE|DATABASE|COLUMN|PROCEDURE|FUNCTION|TRIGGER|VIEW|INDEX|DECLARE|CAST|CONVERT)\b/i,
      message: 'contains forbidden SQL keywords',
    },
    {
      pattern:
        /(--|\/\*|\*\/|;|xp_|sp_|@@|char\(|nchar\(|varchar\(|nvarchar\(|0x)/i,
      message: 'contains forbidden SQL operators or functions',
    },
    {
      pattern: /(['"]).*\s*(OR|AND)\s*['"]?\d+['"]?\s*=\s*['"]?\d+/i,
      message: 'contains SQL injection pattern (OR/AND with conditions)',
    },
    {
      pattern:
        /<\s*\/?\s*(script|iframe|object|embed|applet|meta|link|style|img|svg|form|input|button|textarea|select|option|frame|frameset|body|html|head|base|video|audio|source|track)\b/i,
      message: 'contains forbidden HTML tags',
    },
    {
      pattern: /\bon\w+\s*=/i,
      message: 'contains forbidden JavaScript event handlers',
    },
    {
      pattern:
        /(javascript\s*:|data\s*:|vbscript\s*:|file\s*:|about\s*:|eval\(|expression\(|url\(|import\s+)/i,
      message: 'contains forbidden protocols or expressions',
    },
    {
      pattern: /(['"])\1{2,}/,
      message: 'contains suspicious quote patterns',
    },
    {
      pattern: /\bUNION\b.*\bSELECT\b/i,
      message: 'contains UNION SELECT attack pattern',
    },
  ];

  validate(value: unknown /*args: ValidationArguments*/): boolean {
    if (typeof value !== 'string') {
      return true;
    }

    for (const { pattern } of this.securityPatterns) {
      if (pattern.test(value)) {
        return false;
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    const value = args.value;

    if (typeof value !== 'string') {
      return `${args.property} must be a string`;
    }

    for (const { pattern, message } of this.securityPatterns) {
      if (pattern.test(value)) {
        return `${args.property} ${message}`;
      }
    }

    return `${args.property} contains invalid characters`;
  }
}

export function IsSafeInput(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsSafeInputConstraint,
    });
  };
}
