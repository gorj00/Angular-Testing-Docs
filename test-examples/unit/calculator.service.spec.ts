import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";
import { TestBed, ComponentFixture } from '@angular/core/testing';

describe('CalculatorService', () => {
  let calculator: CalculatorService;
  let loggerSpy: any;

  beforeEach(() => {
    // Mock the services dependency
    loggerSpy = jasmine.createSpyObj('LoggerService', ["log"]);

    // Simulates the environment of using DI
    TestBed.configureTestingModule({
      providers: [
        // Real instance
        CalculatorService,
        // Mocked spy dependency
        { provide: LoggerService, useValue: loggerSpy },
      ]
    });

    // Instantiate the tested service
    calculator = TestBed.get(CalculatorService);
  });

  it('should add two numbers', () => {
    const result = calculator.add(2, 2);
    expect(result).toBe(4);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });

  it('should subtract two numbers', () => {
    const result = calculator.subtract(2, 2);
    expect(result).toBe(0);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });
});
