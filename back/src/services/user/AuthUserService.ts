import prismaClient from "../../prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

interface AuthRequest {
    email: string;
    password: string;
}


class AuthUserService {
    async execute({ email, password }: AuthRequest) {
        //verificar se o email existe.
        const user = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })

        if (!user) {
            throw new Error("User/password incorreto")
        }

        //preciso verificar se a senha que ele mandou esta correta
        const passwordMath = await compare(password, user.password)

        if (!passwordMath) {
            throw new Error("User/password incorreto")
        }

        //Se deu tudo certo vamos gerar o token pro usurio.
        const token = sign(
            {
                name: user.name,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                subject: user.id,
                expiresIn: '30d'
            }
        )

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            token: token

        }
    }
}

export { AuthUserService }