/* eslint-disable @typescript-eslint/ban-types */
import { Injectable } from '@nestjs/common';
import { MatchNotification, Object } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import natural from 'natural';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  // Ordem de precedência na comparação:
  // 0º situation: lost com found e vice versa;
  // 1º object (preferência por apenas uma palavra);
  // 2º color (preferência por apenas uma palavra);
  // - - -
  // 3º brand (só compara se houver em ambos) (preferência por apenas uma palavra);
  // 4º model (só compara se houver em ambos) (preferência por apenas uma palavra);
  // 5º characteristics (só compara se houver em ambos);
  // 6º place (só compara se houver em ambos);
  // 7º info (só compara se houver em ambos);
  // 7 aspectos para serem avaliados, considerar semelhante se atingir pelo menos 5 pontos*

  calculateSimilarity(lostObject: Object, foundObject: Object): boolean {
    // Pontuação começa em 2 pois pressupomos que pelo menos o tipo do obeto e a cor serão iguais ou semelhantes
    let score = 2.0;

    // 1º object (preferência por apenas uma palavra);
    if (lostObject.object !== foundObject.object) return false;
    // FIXME: definir tipos de objetos para não ter dor de cabeça com objetos semelhantes descritos por palavras diferentes

    // 2º color (preferência por apenas uma palavra);
    const diceColor = natural.DiceCoefficient(
      natural.PorterStemmerPt.tokenizeAndStem(foundObject.color).join(' '),
      natural.PorterStemmerPt.tokenizeAndStem(lostObject.color).join(' '),
    );
    if (diceColor < 0.5) return false;

    // 3º brand (só compara se houver em ambos) (preferência por apenas uma palavra);
    if (foundObject.brand && lostObject.brand) {
      const diceBrand = natural.DiceCoefficient(
        natural.PorterStemmerPt.tokenizeAndStem(foundObject.brand).join(' '),
        natural.PorterStemmerPt.tokenizeAndStem(lostObject.brand).join(' '),
      );
      if (diceBrand < 0.5) score++;
    }

    // 4º model (só compara se houver em ambos) (preferência por apenas uma palavra);
    if (foundObject.model && lostObject.model) {
      const diceModel = natural.DiceCoefficient(
        natural.PorterStemmerPt.tokenizeAndStem(foundObject.model).join(' '),
        natural.PorterStemmerPt.tokenizeAndStem(lostObject.model).join(' '),
      );
      if (diceModel < 0.5) score++;
    }

    // 5º characteristics (só compara se houver em ambos);
    if (
      foundObject.characteristics.length > 0 &&
      lostObject.characteristics.length > 0
    ) {
      // junta as características com um espaço, separa tokenizando e tiranto stopwords e junta novamente para calcular ditância
      const foundCharac = foundObject.characteristics.join(' ');
      const lostCharac = lostObject.characteristics.join(' ');
      const diceCharac = natural.DiceCoefficient(
        natural.PorterStemmerPt.tokenizeAndStem(foundCharac).join(' '),
        natural.PorterStemmerPt.tokenizeAndStem(lostCharac).join(' '),
      );
      if (diceCharac < 0.5) score++;
    }

    // 6º place (só compara se houver em ambos);
    if (
      foundObject.characteristics.length > 0 &&
      lostObject.characteristics.length > 0
    ) {
      // junta os lugares com um espaço, separa tokenizando e tiranto stopwords e junta novamente para calcular ditância
      // const foundPlace = foundObject.place.join(' ');
      // const lostPlace = lostObject.place.join(' ');
      const dicePlace = natural.DiceCoefficient(
        natural.PorterStemmerPt.tokenizeAndStem(foundObject.place).join(' '),
        natural.PorterStemmerPt.tokenizeAndStem(lostObject.place).join(' '),
      );
      if (dicePlace < 0.5) score++;
    }

    // 7º info (só compara se houver em ambos);
    if (foundObject.info && lostObject.info) {
      const diceInfo = natural.DiceCoefficient(
        natural.PorterStemmerPt.tokenizeAndStem(foundObject.info).join(' '),
        natural.PorterStemmerPt.tokenizeAndStem(lostObject.info).join(' '),
      );
      if (diceInfo < 0.5) score++;
    }

    return score >= 5;
  }

  async triggerMatchSearch() {
    const lostObjects = await this.prisma.object.findMany({
      where: { situation: 'lost' },
    });

    const foundObjects = await this.prisma.object.findMany({
      where: { situation: 'found' },
    });

    const possibleMatching: Array<{
      userIds: string[];
      objectIds: string[];
      type: string;
    }> = [];

    for (let i = 0; i < lostObjects.length; i++) {
      for (let j = 0; j < foundObjects.length; j++) {
        const similar = this.calculateSimilarity(
          lostObjects[i],
          foundObjects[j],
        );

        if (similar)
          possibleMatching.push({
            userIds: [
              lostObjects[i].recordOwnerId,
              foundObjects[i].recordOwnerId,
            ],
            objectIds: [lostObjects[i].id, foundObjects[i].id],
            type: 'match',
            // whoLost: {
            //   userId: lostObjects[i].recordOwnerId,
            //   objectId: lostObjects[i].id,
            // },
            // whoFound: {
            //   userId: foundObjects[i].recordOwnerId,
            //   objectId: foundObjects[i].id,
            // },
          });
      }
    }

    return possibleMatching;
  }

  async savePossibleMatching(): Promise<MatchNotification[] | never> {
    const data = await this.triggerMatchSearch();
    const result = await this.prisma.matchNotification.createMany({
      data: [...data],
    });
    return result;
  }

  async serveMatchingObjects(): Promise<Object[] | never> {
    return;
  }
}
