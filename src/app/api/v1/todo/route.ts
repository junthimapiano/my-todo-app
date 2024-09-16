import { CreateConnection } from "@/libs/mongodb";
import { NextRequest, NextResponse } from "next/server";
import TodoModel from '@/models/todo';
import { Todo } from "@/app/page";

export async function GET() {
    await CreateConnection();
    const todo = await TodoModel.find({});
    return NextResponse.json({
        status: 'success',
        code: 200,
        message: 'Todos fetched successfully',
        data: todo
    });
}

export async function POST(req: NextRequest) {
    await CreateConnection();
    const new_todo: Todo = await req.json();
    if (!new_todo.title || !new_todo.description || new_todo.completed == undefined || !new_todo.dueDate) {
        return NextResponse.json({
            status: 'error',
            code: 400,
            message: 'Missing required fields'
        });
    }
    const todo = new TodoModel(new_todo);
    await todo.save();
    return NextResponse.json({
        status: 'success',
        code: 201,
        data: todo
    });
}

export async function PUT(req: NextRequest) {
    await CreateConnection();
    const updated_todo = await req.json();
    if (!updated_todo.id) {
        return NextResponse.json({
            status: 'error',
            code: 400,
            message: 'Missing required fields'
        });
    }
    console.log(updated_todo.id);
    const todo = await TodoModel.findById(updated_todo.id);
    todo.completed = !updated_todo.completed;
    await todo.save();
    return NextResponse.json({
        status: 'success',
        code: 200,
        message: 'Todo updated successfully',
        data: todo
    });
}

export async function DELETE(req: NextRequest) {
    await CreateConnection();
    const body = await req.json();
    const { id } = body;
    if (!id) {
        return NextResponse.json({
            status: 'error',
            code: 400,
            message: 'Missing required fields'
        });
    }
    const todo = await TodoModel.findOneAndDelete(id);
    return NextResponse.json({
        status: 'success',
        code: 200,
        message: 'Todo deleted successfully',
        data: todo
    });
}