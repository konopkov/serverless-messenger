export const IoCTypes = {
    MessageService: Symbol.for('MessageService'),

    EmailService: Symbol.for('EmailService'),
    EmailStrategy: Symbol.for('EmailStrategy'),
    TemplateStrategy: Symbol.for('TemplateStrategy'),

    SmsService: Symbol.for('SmsService'),
    SmsStrategy: Symbol.for('SmsStrategy'),

    Logger: Symbol.for('Logger'),

    MessagesRepository: Symbol.for('MessagesRepository'),
};
