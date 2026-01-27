
// import { Tool } from "../DrawComponent/Canvas";
// import { getExistingShapes } from "../../ApiServices/api";
// import { Socket } from "socket.io-client";

// type Shape = {
//     type: "rect";
//     x: number;
//     y: number;
//     width: number;
//     height: number;
// } | {
//     type: "circle";
//     centerX: number;
//     centerY: number;
//     radius: number;
// } | {
//     type: "pencil";
//     points: { x: number; y: number }[];
// } | {
//     type: "line";
//     startX: number;
//     startY: number;
//     endX: number;
//     endY: number;
// }

// export class Game {

//     private canvas: HTMLCanvasElement;
//     private ctx: CanvasRenderingContext2D;
//     private existingShapes: Shape[]
//     private roomId: string;
//     private clicked: boolean;
//     private startX = 0;
//     private startY = 0;
//     private selectedTool: Tool = "circle";
//     private currentPath: { x: number; y: number }[] = [];

//     socket: Socket;

//     constructor(canvas: HTMLCanvasElement, roomId: string, socket: Socket) {
//         this.canvas = canvas;
//         this.ctx = canvas.getContext("2d")!;
//         this.existingShapes = [];
//         this.roomId = roomId;
//         this.socket = socket;
//         this.clicked = false;
//         this.init();
//         this.initHandlers();
//         this.initMouseHandlers();
//     }

//     destroy() {
//         this.canvas.removeEventListener("mousedown", this.mouseDownHandler)
//         this.canvas.removeEventListener("mouseup", this.mouseUpHandler)
//         this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)

//         // Cleanup socket listeners to prevent duplication
//         this.socket.off("draw-shape");
//     }

//     setTool(tool: Tool) {
//         this.selectedTool = tool;
//     }

//     async init() {
//         this.existingShapes = await getExistingShapes(this.roomId);
//         console.log("Loaded shapes:", this.existingShapes);
//         this.clearCanvas();
//     }

//     initHandlers() {
//         this.socket.on("draw-shape", (data: any) => {
//             // data: { shape, roomId }
//             const shape = data.shape;
//             this.existingShapes.push(shape);
//             this.clearCanvas();
//         });
//     }

//     clearCanvas() {
//         this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//         this.ctx.fillStyle = "rgba(0, 0, 0)"
//         this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

//         this.existingShapes.map((shape) => {
//             if (shape.type === "rect") {
//                 this.ctx.strokeStyle = "rgba(255, 255, 255)"
//                 this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
//             } else if (shape.type === "circle") {
//                 this.ctx.beginPath();
//                 this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
//                 this.ctx.stroke();
//                 this.ctx.closePath();
//             } else if (shape.type === "pencil") {
//                 if (shape.points && shape.points.length > 0) {
//                     this.ctx.beginPath();
//                     shape.points.forEach((point, i) => {
//                         if (i === 0) {
//                             this.ctx.moveTo(point.x, point.y);
//                         } else {
//                             this.ctx.lineTo(point.x, point.y);
//                         }
//                     });
//                     this.ctx.stroke();
//                 }
//             } else if (shape.type === "line") {
//                 this.ctx.beginPath();
//                 this.ctx.moveTo(shape.startX, shape.startY);
//                 this.ctx.lineTo(shape.endX, shape.endY);
//                 this.ctx.stroke();
//             }
//         })
//     }

//     mouseDownHandler = (e: MouseEvent) => {
//         this.clicked = true
//         // Adjust for canvas offset
//         const rect = this.canvas.getBoundingClientRect();
//         this.startX = e.clientX - rect.left;
//         this.startY = e.clientY - rect.top;

//         if (this.selectedTool === "pencil") {
//             this.currentPath = [{ x: this.startX, y: this.startY }];
//         }
//     }

//     mouseUpHandler = (e: MouseEvent) => {
//         this.clicked = false
//         const rect = this.canvas.getBoundingClientRect();
//         const currentX = e.clientX - rect.left;
//         const currentY = e.clientY - rect.top;

//         const width = currentX - this.startX;
//         const height = currentY - this.startY;

//         const selectedTool = this.selectedTool;
//         let shape: Shape | null = null;
//         if (selectedTool === "rect") {

//             shape = {
//                 type: "rect",
//                 x: this.startX,
//                 y: this.startY,
//                 height,
//                 width
//             }
//         } else if (selectedTool === "circle") {
//             // Fix: Calculate radius and center properly for any direction
//             const radius = Math.sqrt(width * width + height * height) / 2;
//             const centerX = this.startX + width / 2;
//             const centerY = this.startY + height / 2;

//             shape = {
//                 type: "circle",
//                 radius: radius,
//                 centerX: centerX,
//                 centerY: centerY,
//             }
//         } else if (selectedTool === "line") {
//             shape = {
//                 type: "line",
//                 startX: this.startX,
//                 startY: this.startY,
//                 endX: currentX,
//                 endY: currentY
//             }
//         } else if (selectedTool === "pencil") {
//             shape = {
//                 type: "pencil",
//                 points: this.currentPath
//             }
//         }

//         if (!shape) {
//             return;
//         }

//         this.existingShapes.push(shape);

//         this.socket.emit("draw-shape", {
//             shape,
//             roomId: this.roomId
//         });

//         // Reset currentPath
//         this.currentPath = [];
//     }

//     mouseMoveHandler = (e: MouseEvent) => {
//         if (this.clicked) {
//             const rect = this.canvas.getBoundingClientRect();
//             const currentX = e.clientX - rect.left;
//             const currentY = e.clientY - rect.top;

//             const width = currentX - this.startX;
//             const height = currentY - this.startY;

//             this.clearCanvas();
//             this.ctx.strokeStyle = "rgba(255, 255, 255)"
//             const selectedTool = this.selectedTool;

//             if (selectedTool === "rect") {
//                 this.ctx.strokeRect(this.startX, this.startY, width, height);
//             } else if (selectedTool === "circle") {
//                 const radius = Math.sqrt(width * width + height * height) / 2;
//                 const centerX = this.startX + width / 2;
//                 const centerY = this.startY + height / 2;

//                 this.ctx.beginPath();
//                 this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
//                 this.ctx.stroke();
//                 this.ctx.closePath();
//             } else if (selectedTool === "line") {
//                 this.ctx.beginPath();
//                 this.ctx.moveTo(this.startX, this.startY);
//                 this.ctx.lineTo(currentX, currentY);
//                 this.ctx.stroke();
//             } else if (selectedTool === "pencil") {
//                 this.currentPath.push({ x: currentX, y: currentY });
//                 if (this.currentPath.length > 0) {
//                     this.ctx.beginPath();
//                     this.currentPath.forEach((point, i) => {
//                         if (i === 0) {
//                             this.ctx.moveTo(point.x, point.y);
//                         } else {
//                             this.ctx.lineTo(point.x, point.y);
//                         }
//                     });
//                     this.ctx.stroke();
//                 }
//             }
//         }
//     }

//     initMouseHandlers() {
//         this.canvas.addEventListener("mousedown", this.mouseDownHandler)
//         this.canvas.addEventListener("mouseup", this.mouseUpHandler)
//         this.canvas.addEventListener("mousemove", this.mouseMoveHandler)
//     }
// }