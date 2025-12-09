/**
 * DTO para o retorno do método RegistrarPausaControleHorario
 * Equivalente aos parâmetros out do C# (out int registro, out DateTime horario)
 */
export class PausaControleHorarioDto {
  sucesso: boolean;
  registro: number; // ID do registro inserido (equivalente ao out int registro)
  horario: Date; // Data/hora da pausa (equivalente ao out DateTime horario)
}

