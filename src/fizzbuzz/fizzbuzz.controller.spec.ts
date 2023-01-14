import { Test, TestingModule } from '@nestjs/testing';
import { FizzbuzzController } from './fizzbuzz.controller';
import { FizzbuzzService } from './fizzbuzz.service';

/**
 * jest.spyOn(<<objeto>>, '<<metodo-existente>>')
    .mockImplementation(<<nueva-implementacion>>);
 */
describe('FizzbuzzController', () => {
  let controller: FizzbuzzController;
  let service: FizzbuzzService;

  const mockedFizzBuzzValue = 'Buzz';
  const mockFizzBuzzService = {
    fizzbuzz: () => mockedFizzBuzzValue,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FizzbuzzController],
      providers: [FizzbuzzService], //1. Incorporación del servicio para poder usarlo desde el controlador
    })
      .overrideProvider(FizzbuzzService)
      .useValue(mockFizzBuzzService)
      .compile();

    controller = module.get<FizzbuzzController>(FizzbuzzController);
    service = module.get<FizzbuzzService>(FizzbuzzService); //2. Creación de un objeto para el servicio
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return the correct Fizz Buzz word according the introduced number (Using spyOn)', () => {
    const result: string = 'Fizz';
    const fizzbuzzSpy = jest
      .spyOn(service, 'fizzbuzz')
      .mockImplementationOnce(() => result);
    expect(controller.fizzbuzz(3)).toBe(result);
    fizzbuzzSpy.mockRestore(); //opcional, usarlo si no esta definido  jest.clearAllMocks();
  });

  it('should return the correct Fizz Buzz word according the introduced number (Using mocking de servicios)', () => {
    expect(controller.fizzbuzz(5)).toBe(mockedFizzBuzzValue);
  });
});
