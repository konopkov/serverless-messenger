export const IoCTypes = {
    MessageService: Symbol.for('MessageService'),
    MessagesRepository: Symbol.for('MessagesRepository'),
    MessageValidator: Symbol.for('MessageValidator'),

    EmailService: Symbol.for('EmailService'),
    EmailStrategy: Symbol.for('EmailStrategy'),
    TemplateStrategy: Symbol.for('TemplateStrategy'),

    SmsService: Symbol.for('SmsService'),
    SmsStrategy: Symbol.for('SmsStrategy'),

    Logger: Symbol.for('Logger'),
};
