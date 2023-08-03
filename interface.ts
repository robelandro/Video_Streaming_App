import { Types, Document } from 'mongoose';
import { Response } from 'express';
import { RedisClientType } from 'redis';

interface UserType extends Document {
  userName: string;
  password: string;
  listOfVideo?:[Types.ObjectId];
}

interface UserClassType {
	addUser(userName:string, password: string): Promise<UserType>;
	getUser(userName:string, password: string): Promise<UserType>;
	checkifUserExist(userName: string): Promise<boolean>;
}

interface VideoType {
  	_id: Types.ObjectId;
	fileName: string;
	fileType: string;
	fileSize: number;
	owner?: Types.ObjectId;
	ispublic: boolean;
	date?: number;
	filePath?: string;
	save: () => Promise<VideoType>;
}

interface VideoTypeClass extends VideoType {
	upload(req: Response, fileNamePath: string): Promise<VideoType>;
}


interface IRedisClient {
	client: RedisClientType;
	isAlive: () => Promise<boolean>;
	get: (key: string) => Promise<string | null>;
	set: (key: string, value: string, duration: number) => Promise<void>;
	del: (key: string) => Promise<number>;
}

interface TokenJWTType{
	generateToken: (payload: any) => string;
	decodeToken: (token: string) => Promise<string>;
}

interface JsonCacheType {
  push(key: string, value: string): void;
  get(key: string): string | null;
  delete(key: string): void;
}

interface ErrorType extends Error{
	status: number;
}

export { UserType, 
	UserClassType, 
	VideoTypeClass, 
	VideoType, 
	IRedisClient, 
	TokenJWTType,
	JsonCacheType,
	ErrorType
}
