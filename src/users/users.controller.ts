import { Controller } from "@nestjs/common";    
@Controller()
export class UsersController {
    getAllUsers() { 
        return [
            { id: 1, name: 'Mahmoud Ashraf', email:'mahmoud@example.com' },
            { id: 2, name: 'Mohamed Ashraf', email:'mohamed@example.com' },
            { id: 3, name: 'Manal Mohamed', email:'manal@example.com'},    
        ];
    }
}