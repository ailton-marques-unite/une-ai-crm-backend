import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { GrupoAcessoUsuario } from './grupo-acesso-usuario.entity';
import { SubGrupo } from './subgrupo.entity';

@Entity('security.tbl_PermissaoUsuarioXSubGrupo')
export class PermissaoUsuarioXSubGrupo {
  @PrimaryGeneratedColumn({ name: 'Id_PermissaoUsuarioXSubGrupo' })
  idPermissaoUsuarioXSubGrupo: number;

  @Column({ name: 'Id_Usuario' })
  idUsuario: number;

  @Column({ name: 'Id_SubGrupo' })
  idSubGrupo: number;

  @Column({ name: 'Id_GrupoAcessoUsuario' })
  idGrupoAcessoUsuario: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'Id_Usuario' })
  usuario: Usuario;

  @ManyToOne(() => SubGrupo)
  @JoinColumn({ name: 'Id_SubGrupo' })
  subGrupo: SubGrupo;

  @ManyToOne(() => GrupoAcessoUsuario)
  @JoinColumn({ name: 'Id_GrupoAcessoUsuario' })
  grupoAcessoUsuario: GrupoAcessoUsuario;
}

