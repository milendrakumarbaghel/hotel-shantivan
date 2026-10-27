// Video pipeline for Hotel Shantivan (macOS only — uses AVFoundation, no ffmpeg needed).
//
// For every entry in media/media-sources.json:
//   videos  -> public/assets/videos/<id>.mp4   (audio track removed, H.264 passthrough, fast-start)
//           -> media/.cache/stills/<id>-poster.jpg   (first frame, used as the <video> poster)
//   stills  -> media/.cache/stills/<id>.jpg   (frame grabbed at `at` × duration)
//
// Run with:  swift scripts/process-videos.swift   (or `npm run media`, which also runs optimize-media.mjs)

import AVFoundation
import AppKit
import Foundation

let root = FileManager.default.currentDirectoryPath
let originals = "\(root)/media/originals"
let videoOut = "\(root)/public/assets/videos"
let stillOut = "\(root)/media/.cache/stills"

try FileManager.default.createDirectory(atPath: videoOut, withIntermediateDirectories: true)
try FileManager.default.createDirectory(atPath: stillOut, withIntermediateDirectories: true)

struct Sources: Decodable {
  struct Video: Decodable { let id: String; let source: String }
  struct Still: Decodable { let id: String; let source: String; let at: Double }
  let videos: [Video]
  let stills: [Still]
}

let json = try Data(contentsOf: URL(fileURLWithPath: "\(root)/media/media-sources.json"))
let sources = try JSONDecoder().decode(Sources.self, from: json)

func writeFrame(_ asset: AVAsset, at fraction: Double, to path: String) throws {
  let generator = AVAssetImageGenerator(asset: asset)
  generator.appliesPreferredTrackTransform = true
  generator.requestedTimeToleranceBefore = .zero
  generator.requestedTimeToleranceAfter = .zero
  let duration = CMTimeGetSeconds(asset.duration)
  let time = CMTime(seconds: max(0, min(duration - 0.05, duration * fraction)), preferredTimescale: 600)
  let image = try generator.copyCGImage(at: time, actualTime: nil)
  let rep = NSBitmapImageRep(cgImage: image)
  guard let data = rep.representation(using: .jpeg, properties: [.compressionFactor: 0.95]) else {
    throw NSError(domain: "frame", code: 1)
  }
  try data.write(to: URL(fileURLWithPath: path))
}

func exportSilent(_ asset: AVAsset, to path: String) throws {
  guard let track = asset.tracks(withMediaType: .video).first else { throw NSError(domain: "video", code: 1) }
  let composition = AVMutableComposition()
  guard let out = composition.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid) else {
    throw NSError(domain: "video", code: 2)
  }
  try out.insertTimeRange(CMTimeRange(start: .zero, duration: asset.duration), of: track, at: .zero)
  out.preferredTransform = track.preferredTransform

  try? FileManager.default.removeItem(atPath: path)
  guard let session = AVAssetExportSession(asset: composition, presetName: AVAssetExportPresetPassthrough) else {
    throw NSError(domain: "video", code: 3)
  }
  session.outputURL = URL(fileURLWithPath: path)
  session.outputFileType = .mp4
  session.shouldOptimizeForNetworkUse = true

  let done = DispatchSemaphore(value: 0)
  session.exportAsynchronously { done.signal() }
  done.wait()
  if session.status != .completed { throw session.error ?? NSError(domain: "video", code: 4) }
}

for video in sources.videos {
  let asset = AVURLAsset(url: URL(fileURLWithPath: "\(originals)/\(video.source)"))
  try exportSilent(asset, to: "\(videoOut)/\(video.id).mp4")
  try writeFrame(asset, at: 0, to: "\(stillOut)/\(video.id)-poster.jpg")
  print("video  \(video.id)")
}

for still in sources.stills {
  let asset = AVURLAsset(url: URL(fileURLWithPath: "\(originals)/\(still.source)"))
  try writeFrame(asset, at: still.at, to: "\(stillOut)/\(still.id).jpg")
  print("still  \(still.id)")
}
