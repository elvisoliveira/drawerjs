
var utils = new Utils();

describe("Utils", function () {

	it("should return an object upon instantiation", function () {
		expect(utils).to.be.an("object");
	});
});

describe("Methods", function () {

	describe("#isElement", function () {
		it("should be false when null", function () {
			expect(utils.isElement(null)).to.be.false;
		});
		it("should be true when DOM element", function () {
			expect(utils.isElement(document.body)).to.be.true;
		});
		it("should not be true when []", function () {
			expect(utils.isElement([])).to.be.false;
		});
		it("should not be true when new Array()", function () {
			expect(utils.isElement(new Array())).to.be.false;
		});
		it("should not be true when new Object()", function () {
			expect(utils.isElement(new Object())).to.be.false;
		});
		it("should not be true when {}", function () {
			expect(utils.isElement({})).to.be.false;
		});
		it("should not be true when Object.create(null)", function () {
			expect(utils.isElement(Object.create(null))).to.be.false;
		});
		it("should not be true when Object.create(Object.prototype)", function () {
			expect(utils.isElement(Object.create(Object.prototype))).to.be.false;
		});
		it("should not be true when new String()", function () {
			expect(utils.isElement(new String())).to.be.false;
		});
		it("should not be true when \"\"", function () {
			expect(utils.isElement("")).to.be.false;
		});
		it("should not be true when new Function()", function () {
			expect(utils.isElement(new Function())).to.be.false;
		});
		it("should not be true when function () {}", function () {
			expect(utils.isElement(function () {})).to.be.false;
		});
		it("should not be true when undefined", function () {
			expect(utils.isElement(undefined)).to.be.false;
		});
		it("should not be true when 200", function () {
			expect(utils.isElement(200)).to.be.false;
		});
	});
});