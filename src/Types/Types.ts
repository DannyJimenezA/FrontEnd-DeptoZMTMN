// Interfaz para DecodedToken con roles y permisos incluidos
export interface DecodedToken {
  roles: Role[]; // Lista de roles del usuario
  permissions: Permission[]; // Lista de permisos del usuario
  sub: number; // ID del usuario (userId)
  email: string;
  name: string;
}

// Interfaz para los permisos
export interface Permission {
  id: number;
  action: string;
  resource: string;
}

// Interfaz para los roles
export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[]; 
  users: {
    
  }}

// Interfaz para las entidades relacionadas
export interface Denuncia {
  id: number;
  Date: string;
  nombreDenunciante: string;
  cedulaDenunciante: string;
  notificacion: boolean;
  metodoNotificacion?: string;
  medioNotificacion?: string;
  tipoDenuncia: {
    id: number;
    descripcion: string;
  };
  descripcion: string;
  lugarDenuncia: {
    id: number;
    descripcion: string;
  };
  ubicacion: string;
  evidencia: boolean;
  archivosEvidencia?: string | string[];
  detallesEvidencia?: string;
  status: string;
}

export interface Concesion {
  id: number;
  ArchivoAdjunto: string;
  Date: string;
  status?: string;
  user?: {
    cedula: string;
    nombre: string;
    apellido1: string;
    email: string;
  };
}

export interface Precario {
  id: number;
  ArchivoAdjunto: string;
  Date: string;
  status?: string;
  user?: {
    cedula: string;
    nombre: string;
    apellido1: string;
    apellido2: string;
    email: string;
  };
}

export interface CopiaExpediente {
  id: number;
  Date: string;
  idExpediente: number;
  nombreSolicitante: string;
  telefonoSolicitante: string;
  medioNotificacion: string;
  numeroExpediente: string;
  copiaCertificada: boolean;
  status?: string;
  user?: {
    id: number;
    nombre: string;
    apellido1: string;
    apellido2: string;
    cedula: string;
    email: string;
  };
}

export interface RevisionPlano {
  id: number;
  Date: string;
  NumeroExpediente: string;
  NumeroPlano: string;
  ArchivosAdjuntos: string;
  status?: string;
  user?: {
    id: number;
    nombre: string;
    apellido1: string;
    apellido2: string;
    cedula: string;
    email: string;
  };
}

export interface Prorroga {
  id: number;
  ArchivoAdjunto: string;
  Date: string; 
  status?: string;
  user?: {
    id: number;
    nombre: string;
    apellido1: string;
    apellido2: string;
    cedula: string;
    email: string;
  };
}

export interface Cita {
  id: number;
  description: string;
  date: string; 
  time: string;
  user: {
    id: number;
    nombre: string;
    cedula: string;
    email: string;
  };
  status: string;
}

export interface User {
  id: number;
  cedula: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  email: string;
  telefono: number;
  roles: {
    id: number;
    name: string;
    permissions: Permission[];
  }[];
}

export interface Usuario {
  id: number;
  cedula: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  email: string;
  telefono: number;
  isActive: boolean;
  roles: {
    id: number,
    name: string;
  }[];
}
