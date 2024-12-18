const fs = require('fs').promises;
const path = require('path');

class ChronospatialComputer {
  constructor(registers, program) {
    this.registers = registers;
    this.program = program;
    this.pointer = 0;
    this.output = [];
    this.instructions = {
      0: this.adv.bind(this),
      1: this.bxl.bind(this),
      2: this.bst.bind(this),
      3: this.jnz.bind(this),
      4: this.bxc.bind(this),
      5: this.out.bind(this),
      6: this.bdv.bind(this),
      7: this.cdv.bind(this)
    };
  }

  combo(operand) {
    if (operand >= 0 && operand <= 3) return operand;
    else if (operand === 4) return this.registers.get('A');
    else if (operand === 5) return this.registers.get('B');
    else if (operand === 6) return this.registers.get('C');
    else return null;
  }

  adv(operand) {
    let numerator = this.registers.get('A');
    let denominator = 2 ** this.combo(operand);

    let res = Math.trunc(numerator / denominator);
    this.registers.set('A', res);
  }

  bxl(operand) {
    let res = this.registers.get('B') ^ operand;
    this.registers.set('B', res);
  }

  bst(operand) {
    let res = this.combo(operand) % 8;
    this.registers.set('B', res);
  }

  jnz(operand) {
    if (this.registers.get('A') === 0) this.pointer += 2;
    else this.pointer = operand;
  }

  bxc(_operand) {
    let res = this.registers.get('B') ^ this.registers.get('C');
    this.registers.set('B', res);
  }

  out(operand) {
    let res = this.combo(operand) % 8;
    this.output.push(res);
  }

  bdv(operand) {
    let numerator = this.registers.get('A');
    let denominator = 2 ** this.combo(operand);

    let res = Math.trunc(numerator / denominator);
    this.registers.set('B', res);
  }

  cdv(operand) {
    let numerator = this.registers.get('A');
    let denominator = 2 ** this.combo(operand);

    let res = Math.trunc(numerator / denominator);
    this.registers.set('C', res);
  }

  run() {
    while (this.pointer < this.program.length) {
      let opcode = this.program[this.pointer];
      let operand = this.program[this.pointer + 1];
      let instruction = this.instructions[opcode];

      instruction(operand);

      if (opcode !== 3) this.pointer += 2;
    }
  }
}

const chronospatialComputer = async () => {
  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  const information = data
    .trim()
    .split('\n')
    .map(line => line.trim().split(' '));

  const registers = new Map();
  registers.set('A', parseInt(information[0].at(-1)));
  registers.set('B', parseInt(information[1].at(-1)));
  registers.set('C', parseInt(information[2].at(-1)));

  const program = information.at(-1).at(-1).split(',').map(Number);

  const computer = new ChronospatialComputer(registers, program);
  computer.run();

  return computer.output.join(',');
};

chronospatialComputer().then(res => {
  console.log('Computer output:', res);
});
