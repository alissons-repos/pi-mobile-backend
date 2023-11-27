import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Match, Item } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { DiceCoefficient, PorterStemmerPt, RegexpTokenizer } from 'natural';
import { Request } from 'express';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class MatchesService {
  constructor(private readonly prisma: PrismaService) {}

  calculateDinamicScore(lostItem: Item, foundItem: Item): number {
    const lostProps = Object.entries(lostItem);
    const foundProps = Object.entries(foundItem);
    const comparableProps = [
      'objectType',
      'color',
      'place',
      'brand',
      'model',
      'characteristics',
      'info',
    ];

    const availableLostProps = lostProps
      .map((prop) => {
        if (comparableProps.includes(prop[0])) {
          if (prop[1] === '') return null;
          if (prop[1] instanceof Array && prop[1].length === 0) return null;
          return prop[1];
        }
      })
      .filter((prop) => prop != null);

    const availableFoundProps = foundProps
      .map((prop) => {
        if (comparableProps.includes(prop[0])) {
          if (prop[1] === '') return null;
          if (prop[1] instanceof Array && prop[1].length === 0) return null;
          return prop[1];
        }
      })
      .filter((prop) => prop != null);

    // console.log('lost', availableLostProps);
    // console.log('found', availableFoundProps);

    if (availableLostProps.length === 3 || availableFoundProps.length === 3) {
      return 3;
    }

    // if (availableLostProps.length === 4 || availableFoundProps.length === 4) {
    //   return 4;
    // }

    return 4;
  }

  calculateSimilarity(lostItem: Item, foundItem: Item): boolean {
    const myTokenizer = new RegexpTokenizer({ pattern: /[^a-zA-Z0-9]+/ });
    const dinamicScore = this.calculateDinamicScore(lostItem, foundItem);

    let score = 0;

    // 1º objectType (preferência por apenas uma palavra);
    // FIXME: definir tipos de objetos para não ter dor de cabeça com objetos semelhantes descritos por palavras diferentes?
    const diceObjectType = DiceCoefficient(
      PorterStemmerPt.tokenizeAndStem(lostItem.objectType).join(' '),
      PorterStemmerPt.tokenizeAndStem(foundItem.objectType).join(' '),
    );
    // console.log('comparaçãoObjectType:', PorterStemmerPt.tokenizeAndStem(lostItem.objectType).join(' '));
    // console.log('comparaçãoObjectType:', PorterStemmerPt.tokenizeAndStem(foundItem.objectType).join(' '));
    // console.log('diceObjectType:', diceObjectType);
    if (diceObjectType >= 0.75) score++;

    // 2º color (preferência por apenas uma palavra);
    const diceColor = DiceCoefficient(
      PorterStemmerPt.tokenizeAndStem(lostItem.color).join(' '),
      PorterStemmerPt.tokenizeAndStem(foundItem.color).join(' '),
    );
    // console.log('comparaçãoColor:', PorterStemmerPt.tokenizeAndStem(lostItem.color).join(' '));
    // console.log('comparaçãoColor:', PorterStemmerPt.tokenizeAndStem(foundItem.color).join(' '));
    // console.log('diceColor:', diceColor);
    if (diceColor >= 0.5) score++;

    // 3º brand (só compara se houver em ambos) (preferência por apenas uma palavra);
    if (lostItem.brand && foundItem.brand) {
      const diceBrand = DiceCoefficient(
        PorterStemmerPt.tokenizeAndStem(lostItem.brand).join(' '),
        PorterStemmerPt.tokenizeAndStem(foundItem.brand).join(' '),
      );
      // console.log('comparaçãoBrand:', PorterStemmerPt.tokenizeAndStem(lostItem.brand).join(' '));
      // console.log('comparaçãoBrand:', PorterStemmerPt.tokenizeAndStem(foundItem.brand).join(' '));
      // console.log('diceBrand:', diceBrand);
      if (diceBrand >= 0.5) score++;
    }

    // 4º model (só compara se houver em ambos) (preferência por apenas uma palavra);
    if (lostItem.model && foundItem.model) {
      const diceModel = DiceCoefficient(
        myTokenizer.tokenize(lostItem.model).join(' '),
        myTokenizer.tokenize(foundItem.model).join(' '),
      );
      // console.log('comparaçãoModel:', myTokenizer.tokenize(lostItem.model).join(' '));
      // console.log('comparaçãoModel:', myTokenizer.tokenize(foundItem.model).join(' '));
      // console.log('diceModel:', diceModel);
      if (diceModel >= 0.5) score++;
    }

    // 5º characteristics (só compara se houver em ambos);
    if (
      lostItem.characteristics.length > 0 &&
      foundItem.characteristics.length > 0
    ) {
      // junta as características com um espaço, separa tokenizando e tiranto stopwords e junta novamente para calcular ditância
      const lostCharac = lostItem.characteristics.join(' ');
      const foundCharac = foundItem.characteristics.join(' ');
      const diceCharac = DiceCoefficient(
        PorterStemmerPt.tokenizeAndStem(lostCharac).join(' '),
        PorterStemmerPt.tokenizeAndStem(foundCharac).join(' '),
      );
      // console.log('comparaçãoCharacteristics:', PorterStemmerPt.tokenizeAndStem(lostCharac).join(' '));
      // console.log('comparaçãoCharacteristics:', PorterStemmerPt.tokenizeAndStem(foundCharac).join(' '));
      // console.log('diceCharac:', diceCharac);
      if (diceCharac >= 0.5) score++;
    }

    // 6º place (só compara se houver em ambos);
    if (lostItem.place && foundItem.place) {
      const dicePlace = DiceCoefficient(
        myTokenizer.tokenize(lostItem.place).join(' '),
        myTokenizer.tokenize(foundItem.place).join(' '),
      );
      // console.log('comparaçãoPlace:', myTokenizer.tokenize(lostItem.place).join(' '));
      // console.log('comparaçãoPlace:', myTokenizer.tokenize(foundItem.place).join(' '));
      // console.log('dicePlace:', dicePlace);
      if (dicePlace >= 0.5) score++;
    }

    // 7º info (só compara se houver em ambos);
    if (lostItem.info && foundItem.info) {
      const diceInfo = DiceCoefficient(
        PorterStemmerPt.tokenizeAndStem(lostItem.info).join(' '),
        PorterStemmerPt.tokenizeAndStem(foundItem.info).join(' '),
      );
      // console.log('comparaçãoInfo:', PorterStemmerPt.tokenizeAndStem(lostItem.info).join(' '));
      // console.log('comparaçãoInfo:', PorterStemmerPt.tokenizeAndStem(foundItem.info).join(' '));
      // console.log('diceInfo:', diceInfo);
      if (diceInfo >= 0.5) score++;
    }

    // console.log('dinamicScore:', dinamicScore);
    // console.log('pontuaçãoObtida:', score);
    // console.log('- - - - - - - - - - - - - -');
    return score >= dinamicScore;
  }

  @OnEvent('item.*', { async: true })
  async triggerMatchSearch() {
    const lostItems = await this.prisma.item.findMany({
      where: { situation: 'lost' },
    });

    const foundItems = await this.prisma.item.findMany({
      where: { situation: 'found' },
    });

    const matches = await this.prisma.match.findMany({
      select: { itemIds: true },
    });

    const possibleMatching: Array<{
      userIds: string[];
      itemIds: string[];
      type: string;
    }> = [];

    for (let i = 0; i < lostItems.length; i++) {
      for (let j = 0; j < foundItems.length; j++) {
        if (lostItems[i].recordOwnerId === foundItems[j].recordOwnerId) {
          continue;
        }

        const existsMatch = matches.find(
          (match) =>
            match.itemIds[0] === lostItems[i].id &&
            match.itemIds[1] === foundItems[j].id,
        );

        if (existsMatch?.itemIds.length > 0) {
          continue;
        }

        const similar = this.calculateSimilarity(lostItems[i], foundItems[j]);

        if (similar) {
          possibleMatching.push({
            userIds: [lostItems[i].recordOwnerId, foundItems[j].recordOwnerId],
            itemIds: [lostItems[i].id, foundItems[j].id],
            type: 'match',
          });

          await this.prisma.match.create({
            data: {
              userIds: [
                lostItems[i].recordOwnerId,
                foundItems[j].recordOwnerId,
              ],
              itemIds: [lostItems[i].id, foundItems[j].id],
              user: {
                connect: [
                  { id: lostItems[i].recordOwnerId },
                  { id: foundItems[j].recordOwnerId },
                ],
              },
              item: {
                connect: [{ id: lostItems[i].id }, { id: foundItems[j].id }],
              },
              type: 'match',
            },
            include: { user: true, item: true },
          });
        }
      }
    }

    if (possibleMatching.length == 0) return [];

    return possibleMatching;
  }

  async findUserMatches(req: Request): Promise<Match[] | never> {
    try {
      const userID: string = req.user['id'];

      const userMatches = await this.prisma.user.findUnique({
        where: { id: userID },
        include: { matches: true },
      });

      return userMatches.matches;
    } catch (e) {
      console.error('Erro Logado AQUI:', e);
    }
  }

  // async findAllMatches(): Promise<Match[] | never> {
  //   try {
  //     const matches = await this.prisma.match.findMany();

  //     return matches;
  //   } catch (e) {
  //     console.error('Erro Logado AQUI:', e);
  //   }
  // }

  async findMatchById(id: string): Promise<Match | never> {
    const match = await this.prisma.match.findUnique({ where: { id } });

    if (!match) {
      throw new HttpException(
        'Correspondência não encontrada!',
        HttpStatus.NOT_FOUND,
      );
    }

    return match;
  }

  // async removeMatch(req: Request, id: string) {
  //   const userID: string = req.user['id'];

  //   const userMatch = await this.prisma.match.findUnique({
  //     where: { id },
  //   });

  //   if (!userMatch.userIds.includes(userID)) {
  //     throw new HttpException(
  //       'Correspondância não encontrada!',
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }

  //   try {
  //     return await this.prisma.match.delete({ where: { id } });
  //   } catch (e) {
  //     console.error('Erro Logado:', e);
  //   }
  // }
}
