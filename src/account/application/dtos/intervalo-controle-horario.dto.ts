/**
 * DTO para o retorno do método RegistrarIntervaloControleHorario
 * Equivalente aos parâmetros out do C# (out int registro, out DateTime horario)
 */
export class IntervaloControleHorarioDto {
  sucesso: boolean;
  registro: number; // ID do registro inserido (equivalente ao out int registro)
  horario: Date; // Data/hora do intervalo (equivalente ao out DateTime horario)
}

