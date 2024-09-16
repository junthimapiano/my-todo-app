import { CreateConnection } from "@/libs/mongodb";
import { NextRequest, NextResponse } from "next/server";
import TodoModel from '@/models/todo';
import { ITodo } from "@/app/Todo";

export async function GET() {
    await CreateConnection();
    const todo = await TodoModel.find({});
    return NextResponse.json({
        status: 'success',
        code: 200,
        message: 'Todos fetched successfully',
        data: todo.filter((x) => x.status == false)
    });
}

export async function POST(req: NextRequest) {
    await CreateConnection();
    const new_todo: ITodo = await req.json();
    if (!new_todo.name || !new_todo.description || new_todo.status == undefined || !new_todo.dueDate) {
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
    const updated_todo: ITodo = await req.json();
    if (!updated_todo.name || !updated_todo.description || !updated_todo.status || !updated_todo.dueDate) {
        return NextResponse.json({
            status: 'error',
            code: 400,
            message: 'Missing required fields'
        });
    }
    const todo = await TodoModel.findOneAndUpdate({ name: updated_todo.name }, updated_todo, { new: true });
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
    const todo = await TodoModel.findById(id);
    todo.status = true;
    await todo.save();
    return NextResponse.json({
        status: 'success',
        code: 200,
        message: 'Todo deleted successfully',
        data: todo
    });
}