const Observer = require("./Observer");
const AfricaTalking = require("africastalking");

class SmsObserver extends Observer {
  constructor() {
    super();
    if (process.env.AT_API_KEY && process.env.AT_USERNAME) {
      this.africasTalking = AfricaTalking({
        apiKey: process.env.AT_API_KEY,
        username: process.env.AT_USERNAME,
      });
      this.sms = this.africasTalking.SMS;
    }
  }

  async update(data) {
    try {
      const { report, oldStatus, newStatus, citizenPhone } = data;

      if (!citizenPhone || !this.sms) {
        console.log("SMS not configured or no phone number");
        return;
      }

      const message = this.formatMessage(report, oldStatus, newStatus);

      const response = await this.sms.send({
        to: citizenPhone,
        message: message,
        from: "CRIME-RPT",
      });

      console.log("SMS sent:", response);
    } catch (error) {
      console.error("SMS error:", error.message);
    }
  }

  formatMessage(report, oldStatus, newStatus) {
    const messages = {
      en: `Report #${report.reportId}: Status changed from ${oldStatus} to ${newStatus}.`,
      fr: `Rapport #${report.reportId}: Statut changé de ${oldStatus} à ${newStatus}.`,
      rw: `Raporo #${report.reportId}: Imiterere yahindutse kuri ${oldStatus} ikora ${newStatus}.`,
    };

    return messages.en;
  }
}

module.exports = SmsObserver;
