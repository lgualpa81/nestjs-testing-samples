import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { createMock, DeepMocked } from '@golevelup/ts-jest';

import { PokemonService } from './pokemon.service';

describe('PokemonService', () => {
  let pokemonService: PokemonService;
  let httpService: DeepMocked<HttpService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        // {
        //   provide: HttpService,
        //   useValue: createMock<HttpService>(),
        // },
      ],
    })
      //desde la version 8 se puede usar useMocker para no definir varios providers a mockear
      .useMocker(createMock)
      .compile();

    pokemonService = module.get<PokemonService>(PokemonService);
    httpService = module.get(HttpService);
  });

  it('should be defined', () => {
    expect(pokemonService).toBeDefined();
  });

  describe('getPokemon', () => {
    it('Pokemon ID less than 1 should throw error', async () => {
      const getPokemon = pokemonService.getPokemon(0);
      await expect(getPokemon).rejects.toBeInstanceOf(BadRequestException);
    });

    it('Pokemon ID greater than 151 should throw error', async () => {
      const getPokemon = pokemonService.getPokemon(152);
      await expect(getPokemon).rejects.toBeInstanceOf(BadRequestException);
    });

    it('Valid pokemon ID should return the pokemon name', async () => {
      httpService.axiosRef.mockResolvedValueOnce({
        data: {
          species: { name: `bulbasaur` },
        },
        headers: {},
        config: { url: '' },
        status: 200,
        statusText: '',
      });

      const getPokemon = await pokemonService.getPokemon(1);
      expect(getPokemon).toBe('bulbasaur');
    });

    it('if Pokemon API response unexpectedly changes, throw an error', async () => {
      httpService.axiosRef.mockResolvedValueOnce({
        data: `Unexpected data`,
        headers: {},
        config: { url: '' },
        status: 200,
        statusText: '',
      });

      const getPokemon = pokemonService.getPokemon(1);

      await expect(getPokemon).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });
});
