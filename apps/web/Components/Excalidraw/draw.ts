import { Socket } from "socket.io-client";

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
} | {
    type: "pencil";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[] = [];
    private roomId: string;
    private clicked: boolean = false;
    private startX = 0;
    private startY = 0;
    private selectedTool: "circle" | "pencil" | "rect" = "circle";
    private socket: Socket;
    private isDrawer: boolean = false;

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: Socket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.roomId = roomId;
        this.socket = socket;
        this.initHandlers();
        this.initMouseHandlers();
    }

    setDrawer(value: boolean) {
        this.isDrawer = value;
    }

    setTool(tool: "circle" | "pencil" | "rect") {
        this.selectedTool = tool;
    }

    initHandlers() {
        this.socket.on("draw", (data: any) => {
            const shape = data.shape; // data is { shape: ... }
            if (shape) {
                this.existingShapes.push(shape);
                this.clearCanvas();
                this.renderShapes();
            }
        });
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "#1a1a1a";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderShapes() {
        this.existingShapes.forEach((shape) => {
            if (shape.type === "rect") {
                this.ctx.strokeStyle = "#ffffff";
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === "circle") {
                this.ctx.beginPath();
                this.ctx.strokeStyle = "#ffffff";
                this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();
            } else if (shape.type === "pencil") {
                this.ctx.beginPath();
                this.ctx.strokeStyle = "#ffffff";
                this.ctx.moveTo(shape.startX, shape.startY);
                this.ctx.lineTo(shape.endX, shape.endY);
                this.ctx.stroke();
                this.ctx.closePath();
            }
        });
    }

    mouseDownHandler = (e: MouseEvent) => {
        if (!this.isDrawer) return;
        this.clicked = true;
        const rect = this.canvas.getBoundingClientRect();
        this.startX = e.clientX - rect.left;
        this.startY = e.clientY - rect.top;
    }

    mouseUpHandler = (e: MouseEvent) => {
        if (!this.isDrawer || !this.clicked) return;
        this.clicked = false;

        const rect = this.canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        const width = currentX - this.startX;
        const height = currentY - this.startY;

        let shape: Shape | null = null;
        if (this.selectedTool === "rect") {
            shape = { type: "rect", x: this.startX, y: this.startY, height, width };
        } else if (this.selectedTool === "circle") {
            const radius = Math.sqrt(width * width + height * height) / 2;
            shape = { type: "circle", radius, centerX: this.startX + width / 2, centerY: this.startY + height / 2 };
        } else if (this.selectedTool === "pencil") {
            shape = { type: "pencil", startX: this.startX, startY: this.startY, endX: currentX, endY: currentY };
        }

        if (shape) {
            this.existingShapes.push(shape);
            this.socket.emit("draw", { shape });
            this.clearCanvas();
            this.renderShapes();
        }
    }

    mouseMoveHandler = (e: MouseEvent) => {
        if (!this.clicked || !this.isDrawer) return;

        const rect = this.canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        const width = currentX - this.startX;
        const height = currentY - this.startY;

        this.clearCanvas();
        this.renderShapes();
        this.ctx.strokeStyle = "#ffffff";

        if (this.selectedTool === "rect") {
            this.ctx.strokeRect(this.startX, this.startY, width, height);
        } else if (this.selectedTool === "circle") {
            const radius = Math.sqrt(width * width + height * height) / 2;
            this.ctx.beginPath();
            this.ctx.arc(this.startX + width / 2, this.startY + height / 2, Math.abs(radius), 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.closePath();
        } else if (this.selectedTool === "pencil") {
            this.ctx.beginPath();
            this.ctx.moveTo(this.startX, this.startY);
            this.ctx.lineTo(currentX, currentY);
            this.ctx.stroke();

            // Continuous drawing for pencil
            const shape: Shape = { type: "pencil", startX: this.startX, startY: this.startY, endX: currentX, endY: currentY };
            this.existingShapes.push(shape);
            this.socket.emit("draw", { shape });
            this.startX = currentX;
            this.startY = currentY;
        }
    }

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler)
        this.canvas.addEventListener("mouseup", this.mouseUpHandler)
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler)
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler)
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler)
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
        this.socket.off("draw"); // clean up listener
    }
}
