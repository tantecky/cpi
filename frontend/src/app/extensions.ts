interface Date {
  incrementMonth(): void;
}

Date.prototype.incrementMonth = function (): void {
  this.setMonth(this.getMonth() + 1);
};
