import { AudioClip, AudioSource, Director, director, Node } from "cc";
import { EDITOR } from "cc/env";

/**
 * 音频管理器
 */
export class AudioMgr {
    private constructor() {
        if (!EDITOR) {
            director.once(Director.EVENT_AFTER_SCENE_LAUNCH, this.init, this);
        }
    }
    static readonly instance: AudioMgr = new AudioMgr();

    /**音乐播放组件 */
    private musicSource: AudioSource;

    /**音效播放组件池 */
    private effectSourcePool: AudioSource[] = [];

    /**音乐音量 */
    private musicVolume: number;

    /**音效音量 */
    private effectVolume: number;

    /**当前音效组件池索引 */
    private effectSourceIndex: number;


    init() {
        this.musicVolume = app.data.getNumber("musicVolume") ?? 0.5;
        this.effectVolume = app.data.getNumber("effectVolume") ?? 0.5;

        const audioMgrNode = new Node("__AudioMgr__");
        director.getScene().addChild(audioMgrNode);
        director.addPersistRootNode(audioMgrNode);

        this.musicSource = this.createAudioSource(audioMgrNode, this.musicVolume);
        for (let i = 0; i < 5; i++) {
            this.effectSourcePool.push(this.createAudioSource(audioMgrNode, this.effectVolume));
        }
    }

    /**
     * 创建音频源
     * @param audioMgrNode 节点
     * @param musicVolume 音量
     * @returns 音频源组件
     */
    createAudioSource(audioMgrNode: Node, musicVolume: number) {
        const source = audioMgrNode.addComponent(AudioSource);
        source.loop = false;
        source.playOnAwake = false;
        source.volume = musicVolume;
        return source;
    }

    /**
     * 播放音乐
     * @param path 音乐路径
     * @param loop 是否循环播放，默认为：true
     * @param volume 音量大小，默认为：1.0
     */
    async playMusic(path: string, loop: boolean = true, volume: number = 1.0) {
        const clip = await app.res.loadRes<AudioClip>(path);
        this.musicSource.stop();
        this.musicSource.clip = clip;
        this.musicSource.loop = loop;
        this.musicSource.volume = this.musicVolume * volume;
        this.musicSource.play();
    }


    /**
     * 重播当前音乐
     */
    replayMusic() {
        this.musicSource.stop();
        this.musicSource.play();
    }

    /**
     * 暂停当前播放的音乐
     */
    pauseMusic() {
        this.musicSource.pause();
    }

    /**
     * 停止当前播放的音乐
     */
    stopMusic() {
        this.musicSource.stop();
    }

    /**
     * 播放音效
     * @param path 音效路径
     * @param volume 音量大小，默认为：1.0
     */
    async playEffect(path: string, volume: number = 1.0) {
        const clip = await app.res.loadRes<AudioClip>(path);
        const source = this.getNextEffectSource();
        source.playOneShot(clip, this.effectVolume * volume);
    }

    /**
     * 获取下一个音效组件
     * @returns 下一个音效组件
     */
    getNextEffectSource() {
        const source = this.effectSourcePool[this.effectSourceIndex];
        this.effectSourceIndex = (this.effectSourceIndex + 1) % this.effectSourcePool.length;
        return source;
    }

    /**
     * 设置音乐音量
     * @param volume 音量大小，范围 0 ～ 1
     */
    setMusicVolume(volume: number) {
        this.musicVolume = volume;
        this.musicSource.volume = volume;
        app.data.setData("musicVolume", volume);
    }

    /**
     * 获取当前音乐音量
     * @returns 当前音乐音量，范围 0 ～ 1
     */
    getMusicVolume() {
        return this.musicVolume;
    }

    /**
     * 设置音效音量
     * @param volume 音量大小，范围 0 ～ 1
     */
    setEffectVolume(volume: number) {
        this.effectVolume = volume;
        this.effectSourcePool.forEach((source) => { source.volume = volume; });
        app.data.setData("effectVolume", volume);
    }

    /**
     * 获取当前音效音量
     * @returns 当前音效音量，范围 0 ～ 1
     */
    getEffectVolume() {
        return this.effectVolume;
    }
}
