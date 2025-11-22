using System;
using System.IO;
using System.Net;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;
using Verse;

using System.Collections.Generic;
using System.Linq;
using RimWorld.IO;
using RuntimeAudioClipLoader;
using System.Collections;
using PimDeWitte.UnityMainThreadDispatcher;

namespace RimWorldModMakerRuntime
{
	[StaticConstructorOnStartup]
	public static class HotReloadServer
	{
		private static HttpListener listener;
		private static ModContentPack modContentPack;
		private const string UrlPrefix = "http://localhost:8700/";
		private static string modName = "UnknownMod";

		static HotReloadServer()
		{
			// determine mod folder name from assembly location
			string asmPath = Assembly.GetExecutingAssembly().Location ?? AppDomain.CurrentDomain.BaseDirectory;
			string modsToken = Path.DirectorySeparatorChar + "Mods" + Path.DirectorySeparatorChar;
			int idx = asmPath.IndexOf(modsToken, StringComparison.OrdinalIgnoreCase);
			if (idx >= 0)
			{
				string after = asmPath.Substring(idx + modsToken.Length);
				var parts = after.Split([Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar], StringSplitOptions.RemoveEmptyEntries);
				if (parts.Length > 0) modName = parts[0];
			}

			// Read Runtime.json for hotReload flag
			var runtimeJsonPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Mods", modName, "runtime.json");
			if (File.Exists(runtimeJsonPath))
			{
				var txt = File.ReadAllText(runtimeJsonPath);
				var runtimeConfig = JsonUtility.FromJson<RuntimeConfig>(txt); // validate JSON
				if (runtimeConfig.hotReload == false) return; // hot reload disabled
			}

			// Trigger play data reload
			bool triggered = false;
			foreach (var mod in LoadedModManager.RunningMods)
			{
				if (mod.FolderName != modName) { continue; }
				modContentPack = mod;
				triggered = true;
			}
			if (!triggered)
			{
				return;
			}

			// Print startup banner to in-game log
			Log.Message("======================");
			Log.Message(modName);
			Log.Message("http://localhost:8700/");
			Log.Message("======================");

			listener = new HttpListener();
			listener.Prefixes.Add(UrlPrefix);
			listener.Start();

			Task.Run(AcceptLoop);

			// run background accept loop
			var dispatcher = new GameObject();
			dispatcher.AddComponent<UnityMainThreadDispatcher>();
		}

		private static async Task AcceptLoop()
		{
			while (listener != null && listener.IsListening)
			{
				HttpListenerContext ctx = await listener.GetContextAsync().ConfigureAwait(false);
				HotReloadServer.HandleContext(ctx);
			}
		}

		private static void HandleContext(HttpListenerContext ctx)
		{
			var req = ctx.Request;
			var res = ctx.Response;

			if (req.HttpMethod == "GET" && req.RawUrl == "/")
			{
				string html = "<html><head><meta charset=\"utf-8\"></head><body>" +
								"<h3>RimWorld Mod Maker - Hot Reload</h3>" +
								"<button onclick=\"fetch('/hot-reload',{method:'POST'})\">Hot Reload</button>" +
								"</body></html>";
				byte[] buffer = Encoding.UTF8.GetBytes(html);
				res.ContentType = "text/html; charset=utf-8";
				res.ContentLength64 = buffer.Length;
				res.OutputStream.Write(buffer, 0, buffer.Length);
				res.OutputStream.Close();
				return;
			}

			if (req.HttpMethod == "POST" && req.RawUrl.StartsWith("/hot-reload", StringComparison.OrdinalIgnoreCase))
			{
				Log.Message("[HotReload] Triggered via HTTP POST /hot-reload");
				try
				{
					UnityMainThreadDispatcher.Instance().Enqueue(() => ReloadAssets());

					// Log.Message("[HotReload] Reload Textures1");
					// foreach (Pair<string, LoadedContentItem<Texture2D>> item in XModContentLoader<Texture2D>.LoadAllForMod(modContentPack))
					// {
					// 	Log.Message("[HotReload] Reload Texture: " + item.First);
					// 	string first = item.First;
					// 	first = first.Replace('\\', '/');
					// 	string text = GenFilePaths.ContentPath<Texture2D>();
					// 	if (first.StartsWith(text))
					// 	{
					// 		first = first.Substring(text.Length);
					// 	}
					// 	if (first.EndsWith(Path.GetExtension(first)))
					// 	{
					// 		first = first.Substring(0, first.Length - Path.GetExtension(first).Length);
					// 	}
					// 	if (textures.contentList.ContainsKey(first))
					// 	{
					// 		textures.contentList[first] = item.Second.contentItem;
					// 		// no need to add to trie, already exists
					// 	}
					// 	else
					// 	{
					// 		textures.contentList.Add(first, item.Second.contentItem);
					// 		// textures.contentListTrie.Add(first);
					// 		if (item.Second.extraDisposable != null)
					// 		{
					// 			textures.extraDisposables.Add(item.Second.extraDisposable);
					// 		}
					// 	}
					// }


					// var audioClips = modContentPack.GetContentHolder<AudioClip>();
					// audioClips.ClearDestroy();
					// audioClips.ReloadAll(true);

					// var stringAssets = modContentPack.GetContentHolder<string>();
					// stringAssets.ClearDestroy();
					// stringAssets.ReloadAll(true);

					string ok = "OK: Reload triggered";
					byte[] buf = Encoding.UTF8.GetBytes(ok);
					res.ContentType = "text/plain; charset=utf-8";
					res.ContentLength64 = buf.Length;
					res.OutputStream.Write(buf, 0, buf.Length);
					res.OutputStream.Close();
					return;
				}
				catch (Exception ex)
				{
					string err = "ERROR: " + ex.Message;
					byte[] buf = Encoding.UTF8.GetBytes(err);
					res.StatusCode = 500;
					res.ContentType = "text/plain; charset=utf-8";
					res.ContentLength64 = buf.Length;
					res.OutputStream.Write(buf, 0, buf.Length);
					res.OutputStream.Close();
					Log.Error("[HotReload] Reload failed: " + ex);
					return;
				}
			}

			// not found
			res.StatusCode = 404;
			byte[] nf = Encoding.UTF8.GetBytes("Not Found");
			res.ContentType = "text/plain; charset=utf-8";
			res.ContentLength64 = nf.Length;
			res.OutputStream.Write(nf, 0, nf.Length);
			res.OutputStream.Close();
		}

		private static void ReloadAssets()
		{
			var audioClips = modContentPack.GetContentHolder<AudioClip>();
			Log.Message("[HotReload] Reload AudioClips");
			audioClips.ReloadAll();

			var textures = modContentPack.GetContentHolder<Texture2D>();
			Log.Message("[HotReload] Reload Textures");
			textures.ReloadAll();

			var stringAssets = modContentPack.GetContentHolder<string>();
			Log.Message("[HotReload] Reload String Assets");
			stringAssets.ReloadAll();

			Log.Message("[HotReload] Reload Defs");
			PlayDataLoader.HotReloadDefs();
		}
	}
}

[System.Serializable]
public class RuntimeConfig
{
	public bool hotReload = false;
}

namespace PimDeWitte.UnityMainThreadDispatcher
{
	/// Author: Pim de Witte (pimdewitte.com) and contributors, https://github.com/PimDeWitte/UnityMainThreadDispatcher
	/// <summary>
	/// A thread-safe class which holds a queue with actions to execute on the next Update() method. It can be used to make calls to the main thread for
	/// things such as UI Manipulation in Unity. It was developed for use in combination with the Firebase Unity plugin, which uses separate threads for event handling
	/// </summary>
	public class UnityMainThreadDispatcher : MonoBehaviour
	{

		private static readonly Queue<Action> _executionQueue = new Queue<Action>();

		public void Update()
		{
			lock (_executionQueue)
			{
				while (_executionQueue.Count > 0)
				{
					_executionQueue.Dequeue().Invoke();
				}
			}
		}

		/// <summary>
		/// Locks the queue and adds the IEnumerator to the queue
		/// </summary>
		/// <param name="action">IEnumerator function that will be executed from the main thread.</param>
		public void Enqueue(IEnumerator action)
		{
			lock (_executionQueue)
			{
				_executionQueue.Enqueue(() =>
				{
					StartCoroutine(action);
				});
			}
		}

		/// <summary>
		/// Locks the queue and adds the Action to the queue
		/// </summary>
		/// <param name="action">function that will be executed from the main thread.</param>
		public void Enqueue(Action action)
		{
			Enqueue(ActionWrapper(action));
		}

		/// <summary>
		/// Locks the queue and adds the Action to the queue, returning a Task which is completed when the action completes
		/// </summary>
		/// <param name="action">function that will be executed from the main thread.</param>
		/// <returns>A Task that can be awaited until the action completes</returns>
		public Task EnqueueAsync(Action action)
		{
			var tcs = new TaskCompletionSource<bool>();

			void WrappedAction()
			{
				try
				{
					action();
					tcs.TrySetResult(true);
				}
				catch (Exception ex)
				{
					tcs.TrySetException(ex);
				}
			}

			Enqueue(ActionWrapper(WrappedAction));
			return tcs.Task;
		}


		IEnumerator ActionWrapper(Action a)
		{
			a();
			yield return null;
		}


		private static UnityMainThreadDispatcher _instance = null;

		public static bool Exists()
		{
			return _instance != null;
		}

		public static UnityMainThreadDispatcher Instance()
		{
			if (!Exists())
			{
				throw new Exception("UnityMainThreadDispatcher could not find the UnityMainThreadDispatcher object. Please ensure you have added the MainThreadExecutor Prefab to your scene.");
			}
			return _instance;
		}


		void Awake()
		{
			if (_instance == null)
			{
				_instance = this;
				DontDestroyOnLoad(this.gameObject);
			}
		}

		void OnDestroy()
		{
			_instance = null;
		}


	}
}