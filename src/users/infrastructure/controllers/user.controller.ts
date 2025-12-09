import { 
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../../application/services/user.service';
import { User } from '../../domain/entities/user.entity';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @ApiOperation({ summary: 'Create user' })
    @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })   
    create(@Body() user: User): Promise<User> {
        return this.userService.create(user);
    }

    @Get()
    @ApiOperation({ summary: 'Get all items' })
    @ApiResponse({ status: 200, description: 'Returns all items.' })
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an specific item' })
    @ApiResponse({ status: 200, description: 'Returns informations.' })
    findOne(@Param('id') id: number): Promise<User> {
        return this.userService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update an specific item' })
    @ApiResponse({ status: 200, description: 'The item has been successfully updated.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async update (@Param('id') id: number, @Body() user: User): Promise<any> {
      return this.userService.update(id, user);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an specific item' })
    @ApiResponse({ status: 200, description: 'The item has been successfully deleted.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    remove(@Param('id') id: number): Promise<void> {
        return this.userService.remove(id);
    }

}
