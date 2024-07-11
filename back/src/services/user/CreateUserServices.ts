import prismaClient from "../../prisma";
import { hash } from "bcryptjs";


interface UserRequest {
    name: string;
    email: string;
    password: string;

}

class CreateUserService {
    async execute({ name, email, password }: UserRequest) {

        // verificar se ele enviou um email
        if (!email) {
            throw new Error("Esse email não existe ou esta incorreto")
        }

        //verificar se esse email já esta cadastrado na plataforma
        const userAlreadyExits = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })

        if (userAlreadyExits) {
            throw new Error("Este email já está registrado")
        }

        const passwordHash = await hash(password, 8)
        const user = await prismaClient.user.create({
            data: {
                name: name,
                email: email,
                password: passwordHash,
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        })

        return user;
    }
}

export { CreateUserService }