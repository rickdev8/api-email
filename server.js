import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors'; // Importando o pacote cors

dotenv.config();

const app = express();


app.use(cors({
    origin: 'https://portfolio-gray-xi-20.vercel.app',  
    methods: ['GET', 'POST'], 
    allowedHeaders: ['Content-Type', 'Authorization'],  
}));

app.use(express.json());

const PORT = 3001;

const smtp = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
        user: process.env.EMAIL_USER,  
        pass: process.env.EMAIL_PASS
    }
});

// Função para enviar o email
const sendEmail = async (configEmail) => {
    try {
        const result = await smtp.sendMail(configEmail);
        console.log("Email enviado com sucesso:", result);
    } catch (error) {
        console.error("Erro ao enviar email:", error);
    } finally {
        smtp.close();
    }
};

app.get("/oi", (req, res) =>{
    res.send("deu certo")
})

app.post('/send', (req, res) => {
    const { nome, sobrenome, email, message, servico } = req.body;

    const configEmail = {
        from: process.env.EMAIL_USER,  
        to: "ninjarique86@gmail.com",
        subject: `Novo contrato de ${nome} ${sobrenome}`,
        html: `Serviço: ${servico}\n Nome: ${nome}\nSobrenome: ${sobrenome}\nMensagem: ${message}\n Email:${email}`,
    };

    sendEmail(configEmail)
        .then(() => {
            res.send("Email enviado com sucesso!");
        })
        .catch((error) => {
            res.status(500).send("Erro ao enviar o email");
        });
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
