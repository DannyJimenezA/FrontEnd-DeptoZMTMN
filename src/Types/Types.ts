// Interfaz para DecodedToken
export interface DecodedToken {
  roles: string[];
}

// Interfaz para la entidad Denuncia
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
  Status: string;
}

// Interfaz para la entidad Concesion
export interface Concesion {
  id: number;
  ArchivoAdjunto: string;
  Date: String;
  Status?: string;
  user?: {
    cedula: number;
    nombre: string;
    apellido1: string;
    email: string;
  };
}

// Interfaz para el uso precario
export interface Precario {
  id: number;
  ArchivoAdjunto: string;
  Date: String;
  Status?: string;
  user?: {
    cedula: number;
    nombre: string;
    apellido1: string;
    email: string;
  };
}

// Interfaz para copia expediente
export interface CopiaExpediente {
  id:number,
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


// Interfaz para las prórrogas
export interface Prorroga {
  id: number;
  ArchivoAdjunto: string;
  Date: String; 
  Status?: string;
  user?: {
    id: number;
    nombre: string;
    apellido1: string;
    apellido2: string;
    cedula: string;
    email: string;
  };
}


// Interfaz para las citas
export interface Cita {
  id: number;
  description: string;
  date: string; // Fecha como string (ISO)
  time: string;
  user: {
    id: number;
    nombre: string;
    cedula: string;
    email: string;
  };
  status: string;
}


// Interfaz para los usuarios
export interface User {
  id: number;
  nombre: string;
  apellido1: string;
  apellido2: string;
  email: string;
  telefono: number;
  roles: {
    id: number;
    name: string;
    permissions: Permission[];
  };
}


export interface Permission {
  id: number;
  action: string;
  resource: string;
}

 export interface Role {
  id: number;
  name: string;
  users: User[];
  permissions: Permission[];
}

export interface Usuario {
  id: number;
  cedula: number;
  nombre: string;
  apellido1: string;
  apellido2: string;
  email: string;
  telefono: number;
  isActive: boolean;
  roles: {
    name: string;
  }
  
}