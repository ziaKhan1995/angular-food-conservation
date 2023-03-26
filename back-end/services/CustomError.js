class IncompleteTicketError extends Error {
    constructor(message) {
        super(message)

        this.name = this.constructor.name;
        this.code = 'ICOMPLETE-TICKET';
    }
}

module.exports = IncompleteTicketError