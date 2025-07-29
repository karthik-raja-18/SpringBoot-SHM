package com.example.SecondHandMarketplace.models;

import jakarta.persistence.*;

@Entity
public class Roles {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int roleId;

  private String name;

  public Roles() {
  }

  public Roles(int roleId, String name) {
    this.roleId = roleId;
    this.name = name;
  }

  public int getRoleId() {
    return roleId;
  }

  public void setRoleId(int roleId) {
    this.roleId = roleId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  @Override
  public String toString() {
    return "Roles{" +
            "roleId=" + roleId +
            ", name='" + name + '\'' +
            '}';
  }
}
