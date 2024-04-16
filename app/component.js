'use client'
import React, { useRef, useEffect, useState } from "react";
export default function WhiteboardCanvas(){
    const canvasRef = useRef(null);
    const [context, setContext] = useState(null);
    const [drawing, setDrawing] = useState(false);
    const [currentColor, setCurrentColor] = useState('#000000');
    const [lineWidth, setLineWidth] = useState(3);
    const [drawingActions, setDrawingActions] = useState([]);   
    const [currentPath, setCurrentPath] = useState([]);
    const [currentStyle, setCurrentStyle] = useState({color: '#000000', lineWidth: 3});

    useEffect(() => {
        if(canvasRef.current){
            const canvas = canvasRef.current;
            canvas.width = 900;
            canvas.height = 500;
            const ctx = canvas.getContext('2d');
            setContext(ctx);
            reDrawPreviousData(ctx);
        }
    }, []);
    
    const startDrawing = (e) => {
        if(context){
            context.beginPath();
            context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            setDrawing(true);
        }
    };

    const draw = (e) => {
    if (!drawing) return;
    if (context) {
        context.strokeStyle = currentStyle.color; // Memperbarui properti warna konteks
        context.lineWidth = currentStyle.lineWidth;
        context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        context.stroke();
        setCurrentPath([...currentPath, {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY}]);
    }
}

    const endDrawing = () => {
        setDrawing(false);
        context && context.closePath();
        if(currentPath.length > 0){
            setDrawingActions([...drawingActions, currentPath, currentStyle]);
            setCurrentPath([]);
        }
        setCurrentStyle([]);
    };

    const changeColor = (color) => {
        setCurrentColor(color);
        setCurrentStyle({...currentStyle, color});
    };
    
    const changeWidth = (width) => {
        setLineWidth(width);
        setCurrentStyle({...currentStyle, lineWidth: width});
    };

    const undoDrawing = () => {
        if (drawingActions.length > 0) {
            // Membuat salinan dari drawingActions sebelum memodifikasinya
            const newDrawingActions = drawingActions.slice(0, -1); // Menghapus elemen terakhir tanpa memodifikasi state langsung
    
            // Mengatur ulang drawingActions dengan versi yang sudah dimodifikasi
            setDrawingActions(newDrawingActions);
    
            // Menggambar ulang canvas
            const newContext = canvasRef.current.getContext('2d');
            newContext.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Menghapus canvas
    
            // Menggambar ulang setiap aksi yang tersisa
            newDrawingActions.forEach(action => {
                // Pastikan logika penggambaran ulang sesuai dengan struktur data `action`
                // Ini mungkin memerlukan penyesuaian tergantung pada bagaimana Anda menyimpan `drawingActions`
            });
        }
    };

    const clearDrawing = () => {
        setDrawingActions([]);
        setCurrentPath([]);
        const newContext = canvasRef.current.getContext('2d');
        newContext.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    const reDrawPreviousData = (ctx) => {
        drawingActions.forEach(({path, style}) => {
            ctx.beginPath();
            ctx.strokeStyle = style.color;
            ctx.lineWidth = style.lineWidth;
            ctx.moveTo(path[0].x, path[0].y);
            path.forEach((point) =>{
                ctx.lineTo(point.x, point.y);
            });
            ctx.stroke();
        });
    }

    return (
        <div>
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseOut = {endDrawing}
                className = 'border border-gray-400'
            />

            <div className='flex my-4'>
                <div className='flex justify-center space-x-4'>
                {['#8A79AF','#808080', '#FF0000', '#0000FF', '#FFFF00', '#008000', '#FFA500', '#00FFFF', '#000000'].map((color) => (
                <div
                    key={color}
                    style={{
                        backgroundColor: color, // Selalu menampilkan warna
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'inline-block',
                        margin: '4px',
                        border: currentColor === color ? '2px solid #000' : 'none', // Menambahkan border jika warna ini adalah currentColor
                    }}
                    onClick={() => changeColor(color)}
                />
            ))}

                

                </div>
                <div className="flex-grow"/>
                <input
                type='range'
                min = '1'
                max = '10'
                value = {lineWidth}
                onChange= {(e) => changeWidth(e.target.value)}
                />
            </div>
            <div className="flex justify-center my-4">
                <button className="bg-blue-500 text-white px-4 py-2 mr-2"
                onClick = {undoDrawing}>
                        
                        undo
                </button>
                <button className="bg-red-500 text-white px-4 py-2"
                onClick = {clearDrawing}
                >
                        
                        clear
                </button>

            </div>
        </div>
    )

    }