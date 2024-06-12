import { createReadStream } from "fs";
import { parser } from "stream-json";
import { streamArray } from "stream-json/streamers/StreamArray";
import { chain } from "stream-chain";

async function streamFile(
  filename: string,
  onData: (data: any) => void,
  onEnd: () => void,
  onError: (err: Error) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const pipeline = chain([
      createReadStream(filename),
      parser(),
      streamArray(),
    ]);
    pipeline.on("data", onData);

    pipeline.on("end", () => {
      onEnd(); // Call onEnd when the stream is successfully completed
      resolve(); // Resolve the promise on successful completion
    });

    pipeline.on("error", (err: Error) => {
      onError(err); // Call onError to handle the error
      reject(err); // Reject the promise on error
    });
  });
}

export { streamFile };
