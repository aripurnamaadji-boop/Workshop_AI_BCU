import { useEffect, useMemo, useState, type FormEvent } from "react";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import {
  CATEGORY_LABELS,
  fetchBcuPrograms,
  nextPeriod,
  periodLabel,
  saveBcuUpdate,
  type BcuCategory,
  type BcuRow,
} from "../data/bcuApi";
import styles from "./UpdateData.module.css";

type AppUser = { username: string; createdAt: string };

const CATEGORY_ORDER: BcuCategory[] = ["grand", "killer_staff", "killer_nonstaff", "reguler", "mandatory", "talent"];

type EditableRow = BcuRow & { dirty?: boolean };

function toEditValue(v: number | null): string {
  return v === null || v === undefined ? "" : String(v);
}

export default function UpdateData() {
  const [periods, setPeriods] = useState<string[]>([]);
  const [period, setPeriod] = useState<string>("");
  const [rows, setRows] = useState<EditableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  async function load(p?: string) {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBcuPrograms(p);
      setPeriods(data.periods);
      setPeriod(data.period ?? p ?? "");
      setRows(data.rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    loadUsers();
  }, []);

  const [users, setUsers] = useState<AppUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [addingUser, setAddingUser] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  const [userMsg, setUserMsg] = useState<string | null>(null);

  async function loadUsers() {
    setUsersLoading(true);
    try {
      const res = await fetch("/api/auth/users");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memuat daftar user");
      setUsers(data.users);
    } catch (err) {
      setUserError(err instanceof Error ? err.message : String(err));
    } finally {
      setUsersLoading(false);
    }
  }

  async function handleAddUser(e: FormEvent) {
    e.preventDefault();
    setAddingUser(true);
    setUserError(null);
    setUserMsg(null);
    try {
      const res = await fetch("/api/auth/users", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username: newUsername.trim(), password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menambah user");
      setUserMsg(`User "${data.username}" berhasil dibuat`);
      setNewUsername("");
      setNewPassword("");
      await loadUsers();
    } catch (err) {
      setUserError(err instanceof Error ? err.message : String(err));
    } finally {
      setAddingUser(false);
    }
  }

  const grouped = useMemo(() => {
    const map = new Map<BcuCategory, EditableRow[]>();
    for (const cat of CATEGORY_ORDER) map.set(cat, []);
    for (const row of rows) map.get(row.category)?.push(row);
    return map;
  }, [rows]);

  function updateField(id: number, field: "sdbiTarget" | "sdbiAktual" | "biTarget" | "biAktual", raw: string) {
    const value = raw === "" ? null : Number(raw);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: Number.isNaN(value) ? r[field] : value, dirty: true } : r)));
  }

  async function handleAddMonth() {
    const latest = periods[0];
    const target = latest ? nextPeriod(latest) : `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-01`;
    await load(target);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSavedMsg(null);
    try {
      const entries = rows.map((r) => ({
        programId: r.id,
        sdbiTarget: r.sdbiTarget,
        sdbiAktual: r.sdbiAktual,
        biTarget: r.biTarget,
        biAktual: r.biAktual,
      }));
      const result = await saveBcuUpdate(period, entries);
      setSavedMsg(`Tersimpan · ${result.updated} baris diperbarui untuk ${periodLabel(period)}`);
      setRows((prev) => prev.map((r) => ({ ...r, dirty: false })));
      if (!periods.includes(period)) setPeriods((p) => [period, ...p].sort().reverse());
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Update Data BCU"
        subtitle="Input & perbarui angka SdBi (s.d. bulan ini) dan Bi (bulan berjalan) — bisa dibuka kapan saja, mingguan maupun bulanan."
        pills={period ? [periodLabel(period)] : []}
      />

      <Card className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <label className={styles.fieldLabel}>Periode (bulan)</label>
          <select
            className={styles.select}
            value={period}
            onChange={(e) => load(e.target.value)}
            disabled={loading || periods.length === 0}
          >
            {periods.map((p) => (
              <option key={p} value={p}>
                {periodLabel(p)}
              </option>
            ))}
          </select>
          <button className={styles.ghostBtn} onClick={handleAddMonth} disabled={loading}>
            + Tambah bulan baru
          </button>
        </div>
        <div className={styles.toolbarRight}>
          {savedMsg && <span className={styles.savedMsg}>{savedMsg}</span>}
          {error && <span className={styles.errorMsg}>{error}</span>}
          <button className={styles.saveBtn} onClick={handleSave} disabled={saving || loading || rows.length === 0}>
            {saving ? "Menyimpan..." : "Simpan Semua"}
          </button>
        </div>
      </Card>

      {loading ? (
        <Card className={styles.stateCard}>Memuat data...</Card>
      ) : (
        CATEGORY_ORDER.map((cat) => {
          const catRows = grouped.get(cat) ?? [];
          if (catRows.length === 0) return null;
          return (
            <Card key={cat} className={styles.groupCard}>
              <div className={styles.groupTitle}>{CATEGORY_LABELS[cat]}</div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.thLeft}>Sasaran / Development Approach</th>
                      <th>Units</th>
                      <th>Target 2026</th>
                      <th>SdBi Target</th>
                      <th>SdBi Aktual</th>
                      <th>Bi Target</th>
                      <th>Bi Aktual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {catRows.map((row) => (
                      <tr key={row.id} className={row.rowType === "category_total" ? styles.totalRow : undefined}>
                        <td className={styles.thLeft} style={{ paddingLeft: 12 + row.indent * 16 }}>
                          {row.sasaran && <div className={styles.sasaran}>{row.sasaran}</div>}
                          <div className={styles.approach}>
                            {row.no && <span className={styles.noLabel}>{row.no}</span>} {row.approach}
                          </div>
                        </td>
                        <td className={styles.units}>{row.units}</td>
                        <td className={styles.numStatic}>{row.target2026}</td>
                        {(["sdbiTarget", "sdbiAktual", "biTarget", "biAktual"] as const).map((field) => (
                          <td key={field}>
                            <input
                              className={styles.numInput}
                              type="number"
                              value={toEditValue(row[field])}
                              onChange={(e) => updateField(row.id, field, e.target.value)}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          );
        })
      )}

      <Card className={styles.groupCard}>
        <div className={styles.groupTitle}>Kelola User</div>
        <div className={styles.userLayout}>
          <div className={styles.userList}>
            {usersLoading ? (
              <div className={styles.userEmpty}>Memuat daftar user...</div>
            ) : users.length === 0 ? (
              <div className={styles.userEmpty}>Belum ada user.</div>
            ) : (
              users.map((u) => (
                <div key={u.username} className={styles.userRow}>
                  <span className={styles.userAvatar}>{u.username.slice(0, 2).toUpperCase()}</span>
                  <span className={styles.userName}>{u.username}</span>
                </div>
              ))
            )}
          </div>

          <form className={styles.userForm} onSubmit={handleAddUser}>
            <div className={styles.userFormTitle}>Tambah user baru</div>
            <input
              className={styles.userInput}
              type="text"
              placeholder="Username (mis. nama.belakang)"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              required
            />
            <input
              className={styles.userInput}
              type="text"
              placeholder="Password (min. 6 karakter)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
              required
            />
            {userError && <div className={styles.errorMsg}>{userError}</div>}
            {userMsg && <div className={styles.savedMsg}>{userMsg}</div>}
            <button className={styles.saveBtn} type="submit" disabled={addingUser}>
              {addingUser ? "Menyimpan..." : "Tambah User"}
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
}
