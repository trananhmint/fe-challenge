import React, { useState, useRef } from "react";

class InvalidInputError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidInputError";
    }
}

const ProcessWithDelay: React.FC = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const controllerRef = useRef<AbortController | null>(null);
    const [inputValue, setInputValue] = useState<any>([]);
    const [inputTimeout, setInputTimeout] = useState<number>(0)


    const processWithDelay = async (
        numbers: number[],
        delay: number = 1000,
        signal?: AbortSignal
    ): Promise<void> => {
        if (!Array.isArray(numbers)) {
            alert("Input must be an array of numbers");
            setIsProcessing(false);
            throw new InvalidInputError("Input must be an array of numbers");
        }
        if (numbers.length === 0) {
            setIsProcessing(false);
            return Promise.resolve();
        }

        for (let i = 0; i < numbers.length; i++) {
            const num = Number(numbers[i]) || numbers[i];

            if (typeof num !== "number" || isNaN(num)) {
                alert("Array must contain only numbers");
                setIsProcessing(false);
                throw new InvalidInputError("Array must contain only numbers");
            }

            if (signal?.aborted) {
                console.log("Process canceled");
                setIsProcessing(false);
                return;
            }

            await new Promise<void>((resolve, reject) => {
                const timeout = setTimeout(() => {
                    console.log(num);
                    setProgress(((i + 1) / numbers.length) * 100);
                    resolve();
                }, delay);

                signal?.addEventListener("abort", () => {
                    clearTimeout(timeout);
                    reject(new Error("Process was canceled"));
                });

            });
        }
        console.log("Process completed");

        setIsProcessing(false);
    };

    const startProcess = () => {
        if (isProcessing) return;

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;
        setIsProcessing(true);
        setProgress(0);

        processWithDelay(inputValue, inputTimeout, signal).catch(console.error);
    };

    const cancelProcess = () => {
        controllerRef.current?.abort();
        alert("Process canceled");
        setIsProcessing(false);
        setProgress(0);
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value.split(',').map((item) => item.trim()) || [];
        setInputValue(newValue);
    }
    const handleInputTimeout = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputTimeout(Number((e.target.value)) * 1000);
    }

    return (
        <div className="flex flex-col items-center gap-3">
            <h1>Process with Delay</h1>
            <input
                type="text"
                name="input"
                placeholder="Ex:1,2,3,4,5"
                className="w-full px-3 py-2 border rounded"
                onChange={(e) => handleInputChange(e)}
            />
            <div className="flex flex-row items-center gap-2">
                <input
                    type="number"
                    name="timeout"
                    placeholder="1"
                    className="w-full px-3 py-2 border rounded"
                    onChange={(e) => handleInputTimeout(e)}
                /> second(s)
            </div>

            {isProcessing ? (
                <div>
                    <p>Processing...</p>
                    <p></p>
                    <p>Progress: {progress.toFixed(2)}%</p>
                </div>
            ) : (
                <p>Click "Start Process" to begin.</p>
            )}
            <div className="flex gap-5">
                <button className="cursor-pointer px-4 py-1 rounded-lg font-semibold text-base bg-green-500" onClick={startProcess} disabled={isProcessing}>
                    Start Process
                </button>
                <button className="cursor-pointer px-4 py-1 rounded-lg font-semibold text-base bg-red-500" onClick={cancelProcess} disabled={!isProcessing}>
                    Cancel
                </button>
            </div>

        </div>
    );
};

export default ProcessWithDelay;